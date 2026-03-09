use anchor_lang::prelude::*;
use crate::state::PlatformConfig;

#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    ///CHECK: Treasury can be any system account for this MVP
    pub treasury: UncheckedAccount<'info>,

    #[account(
        init,
        payer = admin,
        space = PlatformConfig::INIT_SPACE,
        seeds = [b"platform_config"],
        bump
    )]
    pub platform_config: Account<'info, PlatformConfig>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializePlatform>) -> Result<()> {
    let config = &mut ctx.accounts.platform_config;

    config.admin = ctx.accounts.admin.key();
    config.treasury = ctx.accounts.treasury.key();
    config.bump = ctx.bumps.platform_config;
   
    Ok(())
}
