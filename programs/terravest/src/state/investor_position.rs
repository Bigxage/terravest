use anchor_lang::prelude::*;
use crate::constants::DISCRIMINATOR;

#[account]
pub struct InvestorPosition {
    pub investor: Pubkey,
    pub property: Pubkey,
    pub units_owned: u64,
    pub total_invested_lamports: u64,
    pub bump: u8,
}

impl InvestorPosition {
    pub const INIT_SPACE: usize = DISCRIMINATOR
        + 32 // investor
        + 32 // property
        + 8 // units_owned
        + 8 // total_invested_lamports
        + 1; // bump
}