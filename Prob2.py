
def invert_wiring_offsets(r2l_offsets):
    """Inverts a list of wiring offsets for a rotor.
    Args:
        r2l_offsets (list[int]): the 26 element list of offsets for each contact
    Returns:
        (list[int]): the corresponding 26-element reverse wiring offsets list
    """


# Unit test
def test_invert_wiring_offsets():
    """Tests several R2L and resulting L2R wiring offset lists"""
    assert invert_wiring_offsets([0]*26) == [0]*26
    wiring_offsets = [3,24,13,14,2,25,3,15,11,17,6,25,22,24,7,16,17,11,0,21,7,18,16,23,0,24]
    rev_wiring_offsets = [23,2,13,12,24,1,23,11,15,9,20,1,4,2,19,10,9,15,0,5,19,8,10,3,0,2]
    assert invert_wiring_offsets(wiring_offsets) == rev_wiring_offsets
    assert invert_wiring_offsets(rev_wiring_offsets) == wiring_offsets

# Startup code
if __name__ == "__main__":
    test_invert_wiring_offsets()
