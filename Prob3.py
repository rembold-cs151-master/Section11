

ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

def invert_key(key):
    """Inverts a 26-letter key for a letter-substitution cipher.
    Args:
        key (str): the 26-letter encryption string
    Returns:
        (str): the corresponding 26-letter decryption string
    """



# Unit test
def test_invert_key():
    """Tests several encryption and resulting decryption strings"""
    assert invert_key(ALPHABET) == ALPHABET
    en_key = "QWERTYUIOPASDFGHJKLZXCVBNM"
    de_key = "KXVMCNOPHQRSZYIJADLEGWBUFT"
    assert invert_key(en_key) == de_key
    assert invert_key(de_key) == en_key

# Startup code
if __name__ == "__main__":
    test_invert_key()

