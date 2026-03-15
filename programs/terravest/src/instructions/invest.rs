use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::{
    error::TerraVestError,
    state::{InvestorPosition, PlatformConfig, Property},
};

#[derive(Accounts)]
pub struct Invest<'info> {
    #[account(mut)]
    pub investor: Signer<'info>,

    #[account(
        seeds = [b"platform_config"],
        bump = platform_config.bump
    )]
    pub platform_config: Account<'info, PlatformConfig>,

    #[account(
        mut,
        seeds = [b"property", property.property_id.to_le_bytes().as_ref()],
        bump = property.bump
    )]
    pub property: Account<'info, Property>,

    /// CHECK: Must match treasury stored in platform config.
    #[account(
        mut,
        address = platform_config.treasury
    )]
    pub treasury: UncheckedAccount<'info>,

    #[account(
        init,
        payer = investor,
        space = 8 + InvestorPosition::INIT_SPACE,
        seeds = [b"position", investor.key().as_ref(), property.key().as_ref()],
        bump
    )]
    pub investor_position: Account<'info, InvestorPosition>,

    pub system_program: Program<'info, System>,
}

pub fn invest_handler(ctx: Context<Invest>, units_to_buy: u64) -> Result<()> {
    require!(units_to_buy > 0, TerraVestError::InvalidUnitsToBuy);

    let property = &mut ctx.accounts.property;
    require!(property.is_active, TerraVestError::PropertyNotActive);

    let remaining_units = property
        .total_units
        .checked_sub(property.units_sold)
        .ok_or(TerraVestError::MathOverflow)?;

    require!(
        units_to_buy <= remaining_units,
        TerraVestError::NotEnoughUnitsRemaining
    );

    let total_price = property
        .price_per_unit_lamports
        .checked_mul(units_to_buy)
        .ok_or(TerraVestError::MathOverflow)?;

    let transfer_accounts = Transfer {
        from: ctx.accounts.investor.to_account_info(),
        to: ctx.accounts.treasury.to_account_info(),
    };

    let transfer_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        transfer_accounts,
    );

    transfer(transfer_ctx, total_price)?;

    property.units_sold = property
        .units_sold
        .checked_add(units_to_buy)
        .ok_or(TerraVestError::MathOverflow)?;

    let position = &mut ctx.accounts.investor_position;
    position.investor = ctx.accounts.investor.key();
    position.property = property.key();
    position.units_owned = units_to_buy;
    position.total_invested_lamports = total_price;
    position.bump = ctx.bumps.investor_position;

    Ok(())
}