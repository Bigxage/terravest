use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

pub use instructions::*;
pub use state::*;

declare_id!("DtGKEvZwqBSsYnkg8em1DbVNrnkpVYGJmq55exQsxKvA");

#[program]
pub mod terravest {
    use super::*;

    pub fn initialize_platform(ctx: Context<InitializePlatform>) -> Result<()> {
        instructions::initialize_platform::handler(ctx)
    }

    pub fn create_property(
        ctx: Context<CreateProperty>,
        property_id: u64,
        name: String, 
        location: String,
        price_per_unit_lamports: u64,
        total_units: u64,
    ) -> Result<()> {
        instructions::create_property::handler(
            ctx, 
            property_id,
            name, 
            location, 
            price_per_unit_lamports,
            total_units,
        )
    }

    pub fn invest(ctx: Context<Invest>, units_to_invest: u64) -> Result<()> {
        instructions::invest::handler(ctx, units_to_invest)
    }
}