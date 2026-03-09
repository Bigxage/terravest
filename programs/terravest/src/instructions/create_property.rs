use anchor_lang::prelude::*;
use crate::{
    constants::{MAX_LOCATION_LENGTH, MAX_NAME_LENGTH},
    error::TerraVestError,
    state::{PlatformConfig, Property},
};

#[derive(Accounts)]
#[instruction(property_id: u64)]
pub struct CreateProperty<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        seeds = [b"platform-config"],
        bump = platform_config.bump,
        constraint = platform_config.admin == admin.key() @ TerraVestError::Unauthorized
    )]
    pub platform_config: Account<'info, PlatformConfig>,

    #[account(
        init,
        payer = admin,
        space = Property::INIT_SPACE,
        seeds = [b"property", &property_id.to_le_bytes()],
        bump
    )]
    pub property: Account<'info, Property>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateProperty>,
    property_id: u64,
    name: String,
    location: String,
    price_per_unit_lamports: u64,
    total_units: u64,
) -> Result<()> {
    require!(name.len() <= MAX_NAME_LENGTH, TerraVestError::NameTooLong);
    require!(
        location.len() <= MAX_LOCATION_LENGTH, 
        TerraVestError::LocationTooLong
    );
    require!(price_per_unit_lamports > 0, TerraVestError::InvalidPrice);
    require!(total_units > 0, TerraVestError::InvalidTotalUnits);

    let property = &mut ctx.accounts.property;

    property.property_id = property_id;
    property.authority = ctx.accounts.admin.key();
    property.name = name;
    property.location = location;
    property.price_per_unit_lamports = price_per_unit_lamports;
    property.total_units = total_units;
    property.units_sold = 0;
    property.is_active = true;
    property.bump = ctx.bumps.property;

    Ok(())
}