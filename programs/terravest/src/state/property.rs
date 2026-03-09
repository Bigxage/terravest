use anchor_lang::prelude::*;
use crate::constants::{DISCRIMINATOR, MAX_LOCATION_LENGTH, MAX_NAME_LENGTH};

#[account]
pub struct Property {
    pub property_id: u64,
    pub authority: Pubkey,
    pub name: String,
    pub location: String,
    pub price_per_unit_lamports: u64,
    pub total_units: u64,
    pub units_sold: u64,
    pub is_active: bool,
    pub bump: u8,
}

impl Property {
    pub const INIT_SPACE: usize = DISCRIMINATOR
        + 8 // property_id
        + 32 // authority
        + 4 + MAX_NAME_LENGTH // name (string with max length)
        + 4 + MAX_LOCATION_LENGTH // location (string with max length)
        + 8 // price_per_unit_lamports
        + 8 // total_units
        + 8 // units_sold
        + 1 // is_active
        + 1; // bump
}