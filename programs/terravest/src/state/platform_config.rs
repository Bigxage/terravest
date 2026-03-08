use anchor_lang::prelude::*;
use crate::constants::DISCRIMINATOR;

#[account]
pub struct PlatformConfig {
    pub admin: Pubkey,
    pub treasury: Pubkey,
    pub bump: u8,
}

impl PlatformConfig {
    pub const INIT_SPACE: usize = DISCRIMINATOR + 32 + 32 + 1; // discriminator + admin + treasury + bump
}