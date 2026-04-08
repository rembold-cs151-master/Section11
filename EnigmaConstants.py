# File: EnigmaConstants.py

"""This module defines the constants used in the Enigma simulator."""

ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"   # The letters of the alphabet

# It is worth noting that the number of rotors cannot be changed
# without making significant changes to the EnigmaView.py class,
# which assumes that there are exactly three rotors to match the
# top-view image of the machine.

N_ROTORS = 3                              # The number of rotors

# The early German Enigma machines include three rotors, which advance
# at different speeds.  The rotor on the right is the "fast" rotor,
# which advances on every keystroke.  The rotor in the middle is the
# "medium" rotor, which advances when the fast rotor has made a
# complete revolution.  The rotor at the left is the "slow" rotor,
# which advances when the medium rotor has made a complete cycle.
# The ROTOR_WIRING array lists the three rotors from left to
# right: the slow rotor, the medium rotor, and the fast rotor.
#
# Each rotor contains 26 electrical contacts on the right side, and
# 26 contacts on the left side. Wires randomly connect these contacts
# such that the first contact on the right might be connected to the
# 5th contact on the left. In such a case, an offset of 4 would be
# indicated. A full rotor consists of 26 of these offsets, each
# representing how far the left contact is from the right contact.
# Offsets are all positive, so any that would result in values larger
# than 26 should be wrapped back around to 0 using % 26

S_ROTOR_WIRING = [ 4,9,10,2,7,1,23,9,13,16,3,8,2,9,10,18,7,3,0,22,6,13,5,20,4,10 ]
M_ROTOR_WIRING = [ 0,8,1,7,14,3,11,13,15,18,1,22,10,6,24,13,0,15,7,20,21,3,9,24,16,5 ]
F_ROTOR_WIRING = [ 1,2,3,4,5,6,22,8,9,10,13,10,13,0,10,15,18,5,14,7,16,17,24,21,18,15 ]

ROTOR_WIRING = [
    S_ROTOR_WIRING,
    M_ROTOR_WIRING,
    F_ROTOR_WIRING,
]

# To the left of the slow rotor, the Enigma machine includes a
# component called the "reflector," which implements a fixed
# wiring that remains unchanged as the rotors advance.  The
# constant REFLECTOR_WIRING defines the offsets of the reflector.

REFLECTOR_WIRING=[ 8,22,18,4,1,25,19,22,18,5,2,8,24,3,21,7,23,1,25,18,8,3,19,4,23,7 ]
