
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const crypto = require('crypto');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                tokenVersion: user.tokenVersion ?? 0
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};

const getProfile = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Profile fetched successfully',
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        user.password = await bcrypt.hash(newPassword, 12);
        user.tokenVersion = (user.tokenVersion ?? 0) + 1;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully. Please login again.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to change password'
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If the email is registered, a password reset link has been sent.'
            });
        }

        if (
            !process.env.BREVO_API_KEY ||
            !process.env.EMAIL_USER ||
            !process.env.PASSWORD_RESET_URL
        ) {
            return res.status(500).json({
                success: false,
                message: 'Email service is not configured'
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetUrl = `${process.env.PASSWORD_RESET_URL}?token=${resetToken}`;

        try {
            const emailResponse = await fetch(
                'https://api.brevo.com/v3/smtp/email',
                {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'api-key': process.env.BREVO_API_KEY,
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        sender: {
                            name: 'Kichu Kinben',
                            email: process.env.EMAIL_USER
                        },
                        to: [
                            {
                                email: user.email,
                                name: user.name
                            }
                        ],
                        subject: 'Kichu Kinben - Password Reset',
                        htmlContent: `
                            <h2>Password Reset Request</h2>
                            <p>Hello ${user.name},</p>
                            <p>Click the button below to reset your password.</p>
                            <a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#111;color:#fff;text-decoration:none;border-radius:5px;">
                                Reset Password
                            </a>
                            <p>This link will expire in 15 minutes.</p>
                            <p>If you did not request this, please ignore this email.</p>
                        `
                    })
                }
            );

            const responseText = await emailResponse.text();

            if (!emailResponse.ok) {
                throw new Error(
                    `Brevo API error (${emailResponse.status}): ${responseText}`
                );
            }
        } catch (emailError) {
            console.error('Password reset email error:', emailError);

            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();

            return res.status(500).json({
                success: false,
                message: 'Unable to send password reset email'
            });
        }

        res.status(200).json({
            success: true,
            message: 'If the email is registered, a password reset link has been sent.'
        });
    } catch (error) {
        console.error('Forgot password error:', error);

        res.status(500).json({
            success: false,
            message: 'Unable to process password reset request'
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Reset token is required'
            });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired password reset link'
            });
        }

        user.password = await bcrypt.hash(password, 12);
        user.tokenVersion = (user.tokenVersion ?? 0) + 1;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful. Please login with your new password.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to reset password'
        });
    }
};

const getAdminDashboard = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Admin Dashboard',
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
};

const changeAdminCredentials = async (req, res) => {
    try {
        const { currentPassword, name, email, newPassword } = req.body;

        if (!currentPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password is required'
            });
        }

        if (!name && !email && !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide information to update'
            });
        }

        const user = await User.findById(req.user._id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        if (email) {
            const normalizedEmail = email.toLowerCase().trim();

            const existingUser = await User.findOne({
                email: normalizedEmail,
                _id: { $ne: user._id }
            });

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already registered'
                });
            }

            user.email = normalizedEmail;
        }

        if (name) {
            user.name = name.trim();
        }

        if (newPassword) {
            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'New password must be at least 6 characters'
                });
            }

            user.password = await bcrypt.hash(newPassword, 12);
            user.tokenVersion = (user.tokenVersion ?? 0) + 1;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Admin account updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to update admin account'
        });
    }
};

const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const adminUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: 'admin'
        });

        res.status(201).json({
            success: true,
            message: 'Admin account created successfully',
            admin: {
                id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to create admin account'
        });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: admins.length,
            admins
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to fetch admins'
        });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid admin ID'
            });
        }

        if (!name && !email && !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide information to update'
            });
        }

        const adminUser = await User.findOne({
            _id: id,
            role: 'admin'
        });

        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        if (email) {
            const normalizedEmail = email.toLowerCase().trim();

            const existingUser = await User.findOne({
                email: normalizedEmail,
                _id: { $ne: adminUser._id }
            });

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already registered'
                });
            }

            adminUser.email = normalizedEmail;
        }

        if (name) {
            adminUser.name = name.trim();
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters'
                });
            }

            adminUser.password = await bcrypt.hash(password, 12);
            adminUser.tokenVersion = (adminUser.tokenVersion ?? 0) + 1;
        }

        await adminUser.save();

        res.status(200).json({
            success: true,
            message: 'Admin updated successfully',
            admin: {
                id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to update admin'
        });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid admin ID'
            });
        }

        if (id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own admin account'
            });
        }

        const adminUser = await User.findOne({
            _id: id,
            role: 'admin'
        });

        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        const adminCount = await User.countDocuments({
            role: 'admin'
        });

        if (adminCount <= 1) {
            return res.status(400).json({
                success: false,
                message: 'The last admin account cannot be deleted'
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Admin account deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to delete admin'
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    getAdminDashboard,
    changeAdminCredentials,
    createAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin
};
