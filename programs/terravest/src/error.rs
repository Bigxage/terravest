use anchor_lang::prelude::*;

#[error_code]
pub enum TerraVestError {
    #[msg("Only the platform authority can perform this action.")]
    Unauthorized,

    #[msg("Property name is too long.")]
    NameTooLong,

    #[msg("Property location is too long.")]
    LocationTooLong,

    #[msg("Price per unit must be greater than zero.")]
    InvalidPrice,

    #[msg("Total units must be greater than zero.")]
    InvalidTotalUnits,

    #[msg("Units to buy must be greater than zero.")]
    InvalidUnitsToBuy,

    #[msg("Not enough units remaining for this investment.")]
    NotEnoughUnitsRemaining,

    #[msg("Property is not active for investment.")]
    PropertyNotActive,

    #[msg("Arithmetic Overflow occurred.")]
    MathOverflow,
}
