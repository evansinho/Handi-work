/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *         - verificationStatus
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email address
 *         phoneNumber:
 *           type: string
 *           description: The user's phone number
 *         password:
 *           type: string
 *           description: The user's password
 *         role:
 *           type: string
 *           enum: [CLIENT, FREELANCER, ADMIN]
 *           description: The user's role
 *         verificationStatus:
 *           type: string
 *           enum: [VERIFIED, UNVERIFIED]
 *           description: The verification status of the user
 *         twoFactorEnabled:
 *           type: boolean
 *           description: Whether two-factor authentication is enabled
 *       example:
 *         name: John Doe
 *         email: johndoe@example.com
 *         phoneNumber: "1234567890"
 *         password: "password123"
 *         role: CLIENT
 *         verificationStatus: VERIFIED
 *         twoFactorEnabled: false
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email is already in use
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred during registration
 */
