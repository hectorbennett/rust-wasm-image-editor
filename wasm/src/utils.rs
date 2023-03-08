use uuid::Uuid;

pub fn generate_uid() -> u64 {
    let id = Uuid::new_v4();
    id.to_u128_le() as u64
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_uid() {
        let uid = generate_uid();
        assert!(uid > 0);
    }
}
