

def apply_permutation(index, permutation, offset):
    """
    Translates the index of a character by applying both a permutation
    and a cyclic offset.  The index argument is the position at which
    the process starts and the method returns the new index after
    applying both transformations.
    """

# Unit test
def test_apply_permutation():
    """
    Tests the apply_permutation function

    The below permutation corresponds to the sequence of wires shown in the slides
    and PDF handout.
    """
    ROTOR = "EKMFLGDQVZNTOWYHXUSPAIBRCJ"

# Startup code

if __name__ == "__main__":
    test_apply_permutation()
