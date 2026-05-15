import user from "../models/user.js";

export const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const userProfile = await user.findById(userId).select('-password_hash');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({success: true, data: user});

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};