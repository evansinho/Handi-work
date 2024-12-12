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
 * /api/register:
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

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login to receive a JWT token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 description: The user's password
 *             required:
 *               - email
 *               - password
 *             example:
 *               email: johndoe@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Login successful and JWT token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   description: The JWT token used for subsequent requests
 *       401:
 *         description: Invalid credentials or incorrect password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Server error during login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred during login
 */

/**
 * @swagger
 * /api/2fa/setup:
 *   post:
 *     summary: Set up two-factor authentication for a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user setting up 2FA
 *             required:
 *               - userId
 *             example:
 *               userId: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: 2FA setup successful with a QR code for Google Authenticator
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrCode:
 *                   type: string
 *                   format: uri
 *                   description: Data URL of the QR code for setting up 2FA
 *                 message:
 *                   type: string
 *                   example: 2FA setup successfully
 *       400:
 *         description: Invalid input or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error during 2FA setup
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error setting up 2FA
 */

/**
 * @swagger
 * /api/2fa/verify:
 *   post:
 *     summary: Verify a two-factor authentication code for a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user verifying 2FA
 *               token:
 *                 type: string
 *                 description: The TOTP code generated by the authenticator app
 *             required:
 *               - userId
 *               - token
 *             example:
 *               userId: "123e4567-e89b-12d3-a456-426614174000"
 *               token: "123456"
 *     responses:
 *       200:
 *         description: 2FA code verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 2FA code verified successfully
 *       400:
 *         description: Invalid 2FA code or 2FA not set up for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid 2FA code
 *       500:
 *         description: Server error during 2FA verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error verifying 2FA code
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while retrieving users
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while retrieving the user
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found or invalid input
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while updating the user
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Remove a user by their unique ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique identifier of the user to be deleted
 *     responses:
 *       204:
 *         description: User successfully deleted
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: An error occurred on the server while attempting to delete the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while deleting the user
 */

/**
 * @swagger
 * /api/artisan-profile/approve/{userId}:
 *   post:
 *     summary: Approve an artisan's profile
 *     tags: [Artisan Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the artisan to approve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Artisan profile approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artisan profile approved successfully
 *       403:
 *         description: Unauthorized action, admin role required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You do not have permission to approve artisan profiles
 *       404:
 *         description: Artisan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artisan not found
 *       500:
 *         description: Server error during approval process
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while approving the artisan profile
 */

/**
 * @swagger
 * /api/artisan-profile/reject/{userId}:
 *   post:
 *     summary: Reject an artisan's profile
 *     tags: [Artisan Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the artisan to reject
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Artisan profile rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artisan profile rejected successfully
 *       403:
 *         description: Unauthorized action, admin role required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You do not have permission to reject artisan profiles
 *       404:
 *         description: Artisan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artisan not found
 *       500:
 *         description: Server error during rejection process
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while rejecting the artisan profile
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ArtisanProfile:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - category
 *         - skillLevel
 *         - hourlyRate
 *         - available
 *         - verified
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the artisan profile
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The ID of the associated user
 *         bio:
 *           type: string
 *           nullable: true
 *           description: A brief biography or description of the artisan
 *         category:
 *           type: string
 *           description: The category of work the artisan specializes in
 *         skillLevel:
 *           type: string
 *           enum: [Beginner, Intermediate, Expert]
 *           description: The artisan's skill level
 *         portfolio:
 *           type: string
 *           nullable: true
 *           description: A link or description of the artisan's portfolio
 *         hourlyRate:
 *           type: number
 *           format: decimal
 *           description: The artisan's hourly rate
 *         available:
 *           type: boolean
 *           description: Whether the artisan is currently available for work
 *         ratingsAvg:
 *           type: number
 *           format: decimal
 *           nullable: true
 *           description: The average rating of the artisan
 *         verified:
 *           type: boolean
 *           description: Whether the artisan's profile has been verified
 *         user:
 *           $ref: '#/components/schemas/User'
 *           description: The associated user details
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         userId: "456e1234-e89b-12d3-a456-426614174001"
 *         bio: "Experienced artisan specializing in carpentry and furniture design."
 *         category: "Carpentry"
 *         skillLevel: "Expert"
 *         portfolio: "https://portfolio.example.com/janedoe"
 *         hourlyRate: 50.00
 *         available: true
 *         ratingsAvg: 4.85
 *         verified: true
 *         user:
 *           id: "456e1234-e89b-12d3-a456-426614174001"
 *           name: "Jane Doe"
 *           email: "janedoe@example.com"
 */

/**
 * @swagger
 * /api/artisan-profiles:
 *   post:
 *     summary: Create a new artisan profile
 *     tags: [Artisan Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArtisanProfile'
 *     responses:
 *       201:
 *         description: Artisan profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArtisanProfile'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid data provided
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /api/artisan-profiles/{id}:
 *   get:
 *     summary: Retrieve an artisan profile by ID
 *     tags: [Artisan Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The unique ID of the artisan profile
 *     responses:
 *       200:
 *         description: The artisan profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArtisanProfile'
 *       404:
 *         description: Artisan profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artisan profile not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /api/artisan-profile/{id}:
 *   put:
 *     summary: Update an artisan profile
 *     tags: [Artisan Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the artisan profile to update
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               category:
 *                 type: string
 *               skillLevel:
 *                 type: string
 *               portfolio:
 *                 type: string
 *               hourlyRate:
 *                 type: number
 *     responses:
 *       200:
 *         description: Artisan profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artisan profile updated
 *                 artisanProfile:
 *                   type: object
 *       500:
 *         description: Failed to update artisan profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to update artisan profile
 */

/**
 * @swagger
 * /api/artisan-profile/{id}:
 *   delete:
 *     summary: Delete an artisan profile
 *     tags: [Artisan Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the artisan profile to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Artisan profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artisan profile deleted
 *       500:
 *         description: Failed to delete artisan profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to delete artisan profile
 */

/**
 * @swagger
 * /api/artisans:
 *   get:
 *     summary: Search for artisans based on filters
 *     tags: [Artisan Profile]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         required: false
 *         description: The location to filter artisans by
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         required: false
 *         description: Comma-separated list of skills to filter artisans by
 *     responses:
 *       200:
 *         description: List of available artisans matching the filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ArtisanProfile'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server Error
 */

/**
 * @swagger
 * /artisan/{id}/skill-level:
 *   post:
 *     summary: Create or update the skill level for an artisan
 *     tags: [Artisan Skill Levels]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the artisan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skillLevel:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Expert]
 *                 example: Intermediate
 *     responses:
 *       200:
 *         description: The artisan's skill level was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "artisan123"
 *                 skillLevel:
 *                   type: string
 *                   example: Intermediate
 *       400:
 *         description: Invalid skill level
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid skill level
 *       404:
 *         description: Artisan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Artisan not found
 *       500:
 *         description: Error updating skill level
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error updating skill level
 */

/**
 * @swagger
 * /artisan/{id}/skill-level:
 *   get:
 *     summary: Retrieve the skill level of an artisan
 *     tags: [Artisan Skill Levels]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the artisan
 *     responses:
 *       200:
 *         description: The artisan's skill level
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 skillLevel:
 *                   type: string
 *                   example: Expert
 *       404:
 *         description: Artisan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Artisan not found
 *       500:
 *         description: Error retrieving skill level
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error retrieving skill level
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PortfolioItem:
 *       type: object
 *       required:
 *         - artisanId
 *         - title
 *         - description
 *         - imageUrl
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the portfolio item
 *         artisanId:
 *           type: string
 *           description: The ID of the artisan who owns the portfolio item
 *         title:
 *           type: string
 *           description: The title of the portfolio item
 *         description:
 *           type: string
 *           description: A brief description of the portfolio item
 *         imageUrl:
 *           type: string
 *           description: The URL of the portfolio item's image
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         artisanId: "artisan123"
 *         title: "Modern Kitchen Design"
 *         description: "A contemporary kitchen design with high-quality materials."
 *         imageUrl: "https://example.com/image.jpg"
 */

/**
 * @swagger
 * /api/portfolio:
 *   post:
 *     summary: Upload a portfolio item for an artisan
 *     tags: [Portfolio]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               artisanId:
 *                 type: string
 *                 description: The ID of the artisan
 *               title:
 *                 type: string
 *                 description: The title of the portfolio item
 *               description:
 *                 type: string
 *                 description: A description of the portfolio item
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file for the portfolio item
 *             required:
 *               - artisanId
 *               - title
 *               - description
 *               - image
 *     responses:
 *       201:
 *         description: Portfolio item uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PortfolioItem'
 *       500:
 *         description: Failed to upload portfolio item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to upload portfolio item
 */

/**
 * @swagger
 * /api/portfolio/{artisanId}:
 *   get:
 *     summary: Retrieve all portfolio items for a specific artisan
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: artisanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the artisan
 *     responses:
 *       200:
 *         description: List of portfolio items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PortfolioItem'
 *       500:
 *         description: Failed to retrieve portfolio items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve portfolio items
 */

/**
 * @swagger
 * /api/portfolio/{id}:
 *   delete:
 *     summary: Delete a portfolio item
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the portfolio item to delete
 *     responses:
 *       204:
 *         description: Portfolio item deleted successfully
 *       500:
 *         description: Failed to delete portfolio item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to delete portfolio item
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - category
 *         - location
 *         - budgetMin
 *         - budgetMax
 *         - status
 *       properties:
 *         title:
 *           type: string
 *           description: The job's title
 *         description:
 *           type: string
 *           description: A detailed description of the job
 *         category:
 *           type: string
 *           description: The category of the job (e.g., Web Development, Design)
 *         location:
 *           type: string
 *           description: Job location (Remote or On-site)
 *         budgetMin:
 *           type: number
 *           description: The minimum budget for the job
 *         budgetMax:
 *           type: number
 *           description: The maximum budget for the job
 *         status:
 *           type: string
 *           enum: [PENDING, ACTIVE, COMPLETED, DISPUTED]
 *           description: The status of the job
 *       example:
 *         title: "Website Development"
 *         description: "Looking for a developer to build a company website"
 *         category: "Web Development"
 *         location: "Remote"
 *         budgetMin: 500
 *         budgetMax: 1500
 *         status: "PENDING"
 */

/**
 * @swagger
 * /api/jobs/all:
 *   get:
 *     summary: Retrieve a list of all jobs
 *     tags: [Job]
 *     responses:
 *       200:
 *         description: List of jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while retrieving jobs
 */

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Retrieve jobs with various filters (status, location, category, artisan availability)
 *     tags: [Job]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACTIVE, COMPLETED, DISPUTED]
 *         description: Filter jobs by status
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter jobs by location (e.g., city or region)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter jobs by category (e.g., plumbing, electrical, etc.)
 *       - in: query
 *         name: artisanAvailability
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, UNAVAILABLE]
 *         description: Filter jobs by artisan availability (relevant for clients)
 *     responses:
 *       200:
 *         description: List of filtered jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 *       400:
 *         description: Invalid query parameter(s)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid query parameters
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while retrieving jobs
 */

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Job]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while creating the job"
 */

/**
 * @swagger
 * /api/jobs/{clientId}:
 *   get:
 *     summary: Retrieve jobs created by a client
 *     tags: [Job]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         description: The ID of the client to retrieve their jobs
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 *       400:
 *         description: Client ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Client ID is required."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving jobs"
 */

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: Update an existing job
 *     tags: [Job]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the job to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId:
 *                 type: string
 *                 description: The client's unique identifier
 *               title:
 *                 type: string
 *                 description: The job's title
 *               description:
 *                 type: string
 *                 description: A detailed description of the job
 *               category:
 *                 type: string
 *                 description: The category of the job
 *               location:
 *                 type: string
 *                 description: Job location (Remote or On-site)
 *               budgetMin:
 *                 type: number
 *                 description: The minimum budget for the job
 *               budgetMax:
 *                 type: number
 *                 description: The maximum budget for the job
 *               status:
 *                 type: string
 *                 enum: [PENDING, ACTIVE, COMPLETED, DISPUTED]
 *                 description: The status of the job
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       400:
 *         description: Missing required fields or job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields or job not found"
 *       403:
 *         description: Unauthorized to update the job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You do not have permission to update this job"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the job"
 */

/**
 * @swagger
 * /api/job/{id}/status:
 *   patch:
 *     summary: Update the status of a job
 *     tags: [Job]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the job to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, ACTIVE, COMPLETED, DISPUTED]
 *                 description: The new status of the job
 *             example:
 *               status: "ACTIVE"
 *     responses:
 *       200:
 *         description: Job status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       400:
 *         description: Invalid job status or job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid job status or job not found"
 *       403:
 *         description: Unauthorized to update the job status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You do not have permission to update this job status"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the job status"
 */

/**
 * @swagger
 * /api/job/{jobId}/message:
 *   post:
 *     summary: Send a message to the artisan assigned to a job
 *     tags: [Job]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         description: The ID of the job
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The message to send to the artisan
 *             example:
 *               message: "Can we schedule a quick call to discuss details?"
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Message sent to the artisan"
 *       400:
 *         description: Invalid job ID or message content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid job ID or message content"
 *       403:
 *         description: Unauthorized to send a message to the artisan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You do not have permission to send a message to this artisan"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while sending the message"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserActivityMetrics:
 *       type: object
 *       required:
 *         - totalUsers
 *         - newSignups
 *         - freelancerProfilesCreated
 *         - clientProfilesCreated
 *         - jobPosts
 *         - proposalsSubmitted
 *         - contractsCompleted
 *       properties:
 *         totalUsers:
 *           type: string
 *           description: The total number of users in the system
 *         newSignups:
 *           type: string
 *           description: The number of new signups within the specified date range
 *         artisanProfilesCreated:
 *           type: string
 *           description: The number of freelancer profiles created
 *         clientProfilesCreated:
 *           type: string
 *           description: The number of client profiles created
 *         jobPosts:
 *           type: string
 *           description: The number of job posts created
 *         proposalsSubmitted:
 *           type: string
 *           description: The number of proposals submitted by users
 *         contractsCompleted:
 *           type: string
 *           description: The number of contracts that have been completed
 *       example:
 *         totalUsers: "1000"
 *         newSignups: "150"
 *         artisanProfilesCreated: "200"
 *         clientProfilesCreated: "100"
 *         jobPosts: "300"
 *         proposalsSubmitted: "500"
 *         contractsCompleted: "100"
 *     AppPerformanceMetrics:
 *       type: object
 *       required:
 *         - pendingJobs
 *         - activeJobs
 *         - completedJobs
 *         - disputedJobs
 *         - pendingPayments
 *         - paidPayments
 *         - escrowPayments
 *         - averageRating
 *         - totalContracts
 *         - completedContracts
 *         - activeContracts
 *       properties:
 *         pendingJobs:
 *           type: string
 *           description: The number of pending jobs in the system
 *         activeJobs:
 *           type: string
 *           description: The number of active jobs
 *         completedJobs:
 *           type: string
 *           description: The number of completed jobs
 *         disputedJobs:
 *           type: string
 *           description: The number of disputed jobs
 *         pendingPayments:
 *           type: string
 *           description: The number of payments that are pending
 *         paidPayments:
 *           type: string
 *           description: The number of payments that have been paid
 *         escrowPayments:
 *           type: string
 *           description: The number of escrow payments
 *         averageRating:
 *           type: number
 *           format: float
 *           description: The average rating of the platform's users
 *         totalContracts:
 *           type: string
 *           description: The total number of contracts
 *         completedContracts:
 *           type: string
 *           description: The number of completed contracts
 *         activeContracts:
 *           type: string
 *           description: The number of active contracts
 *       example:
 *         pendingJobs: "50"
 *         activeJobs: "200"
 *         completedJobs: "300"
 *         disputedJobs: "10"
 *         pendingPayments: "100"
 *         paidPayments: "200"
 *         escrowPayments: "50"
 *         averageRating: 4.5
 *         totalContracts: "1000"
 *         completedContracts: "800"
 *         activeContracts: "150"
 */

/**
 * @swagger
 * /metrics/user-activity:
 *   get:
 *     summary: Get user activity metrics within a specified date range
 *     tags: [Metrics]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date for the date range (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The end date for the date range (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successfully retrieved user activity metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserActivityMetrics'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /metrics/app-performance:
 *   get:
 *     summary: Get app performance metrics
 *     tags: [Metrics]
 *     responses:
 *       200:
 *         description: Successfully retrieved app performance metrics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppPerformanceMetrics'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Rating:
 *       type: object
 *       required:
 *         - jobId
 *         - fromUserId
 *         - toUserId
 *         - rating
 *       properties:
 *         jobId:
 *           type: string
 *           description: The ID of the job being rated
 *         fromUserId:
 *           type: string
 *           description: The ID of the user giving the rating
 *         toUserId:
 *           type: string
 *           description: The ID of the user receiving the rating
 *         rating:
 *           type: number
 *           format: float
 *           description: The rating given by the user (1-5 scale)
 *         review:
 *           type: string
 *           description: An optional review for the rated user
 *       example:
 *         jobId: "b0fd4c93-5064-4e3e-8e04-e2ff0d76a093"
 *         fromUserId: "d6e5e017-e174-4ad9-9316-4b9261c54613"
 *         toUserId: "c53a7e7f-b378-41c2-970f-bd3d432fe4a6"
 *         rating: 4.5
 *         review: "Great job, would hire again!"
 *
 *     UserProfile:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - role
 *         - averageRating
 *       properties:
 *         id:
 *           type: string
 *           description: The unique ID of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         role:
 *           type: string
 *           description: The role of the user (e.g., CLIENT, ARTISAN)
 *         averageRating:
 *           type: number
 *           format: float
 *           description: The average rating of the user based on received ratings
 *       example:
 *         id: "c53a7e7f-b378-41c2-970f-bd3d432fe4a6"
 *         name: "John Doe"
 *         role: "ARTISAN"
 *         averageRating: 4.2
 */

/**
 * @swagger
 * /ratings:
 *   post:
 *     summary: Submit a rating for a user
 *     tags: [Ratings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rating'
 *     responses:
 *       201:
 *         description: Rating successfully submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rating submitted successfully
 *       400:
 *         description: Bad request, invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid data provided
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /ratings/{userId}:
 *   get:
 *     summary: Retrieve all ratings for a specific user
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user whose ratings are being retrieved
 *     responses:
 *       200:
 *         description: Successfully retrieved all ratings for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   jobId:
 *                     type: string
 *                     description: The ID of the job being rated
 *                   fromUserId:
 *                     type: string
 *                     description: The ID of the user who gave the rating
 *                   toUserId:
 *                     type: string
 *                     description: The ID of the user receiving the rating
 *                   rating:
 *                     type: number
 *                     format: float
 *                     description: The rating given by the user (1-5 scale)
 *                   review:
 *                     type: string
 *                     description: The optional review for the rated user
 *               example:
 *                 - jobId: "b0fd4c93-5064-4e3e-8e04-e2ff0d76a093"
 *                   fromUserId: "d6e5e017-e174-4ad9-9316-4b9261c54613"
 *                   toUserId: "c53a7e7f-b378-41c2-970f-bd3d432fe4a6"
 *                   rating: 4.5
 *                   review: "Great job, would hire again!"
 *                 - jobId: "a12f3b47-ffb5-4c7b-8d62-b35cd48b3d55"
 *                   fromUserId: "a2f9e017-b428-4ad9-9316-4b9261c67890"
 *                   toUserId: "c53a7e7f-b378-41c2-970f-bd3d432fe4a6"
 *                   rating: 3.0
 *                   review: "Good work, but room for improvement."
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - jobId
 *         - contractId
 *         - amount
 *         - currency
 *         - paymentMethod
 *       properties:
 *         id:
 *           type: string
 *           description: The unique ID of the payment
 *         jobId:
 *           type: string
 *           description: The ID of the associated job
 *         contractId:
 *           type: string
 *           description: The ID of the associated contract
 *         amount:
 *           type: number
 *           format: float
 *           description: The payment amount
 *         currency:
 *           type: string
 *           description: The currency for the payment
 *         paymentMethod:
 *           type: string
 *           description: The method of payment
 *         paymentStatus:
 *           type: string
 *           enum: [PENDING, PAID, ESCROW]
 *           description: The status of the payment
 *       example:
 *         id: "b0fd4c93-5064-4e3e-8e04-e2ff0d76a093"
 *         jobId: "job123"
 *         contractId: "contract456"
 *         amount: 100.00
 *         currency: "USD"
 *         paymentMethod: "CREDIT_CARD"
 *         paymentStatus: "PENDING"
 *
 * /payment:
 *   post:
 *     summary: Create a new payment record
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 *
 * /payment/{id}/process:
 *   post:
 *     summary: Process a payment
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the payment
 *     responses:
 *       200:
 *         description: Payment successfully processed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Payment not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 *
 * /payment/{id}:
 *   get:
 *     summary: Get payment details
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the payment
 *     responses:
 *       200:
 *         description: Successfully retrieved payment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Payment not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /message/job/{jobId}:
 *   get:
 *     summary: Get all messages for a specific job
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job
 *     responses:
 *       200:
 *         description: A list of messages for the specified job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The message ID
 *                       jobId:
 *                         type: string
 *                         description: The ID of the job
 *                       fromUserId:
 *                         type: string
 *                         description: The ID of the sender
 *                       toUserId:
 *                         type: string
 *                         description: The ID of the recipient
 *                       message:
 *                         type: string
 *                         description: The message content
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of message creation
 *       500:
 *         description: Failed to retrieve messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 */

/**
 * @swagger
 * /conversation/{fromUserId}/{toUserId}:
 *   get:
 *     summary: Get a conversation between two users
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: fromUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the sender
 *       - in: path
 *         name: toUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the recipient
 *     responses:
 *       200:
 *         description: A list of messages exchanged between the two users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The message ID
 *                       fromUserId:
 *                         type: string
 *                         description: The ID of the sender
 *                       toUserId:
 *                         type: string
 *                         description: The ID of the recipient
 *                       message:
 *                         type: string
 *                         description: The message content
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of message creation
 *       500:
 *         description: Failed to retrieve the conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The unique ID of the category
 *         name:
 *           type: string
 *           description: The name of the category
 *         description:
 *           type: string
 *           description: A brief description of the category
 *       example:
 *         id: "c1a2b3d4-e5f6-7g8h-9i0j-klmnopqrstu"
 *         name: "Plumbing"
 *         description: "Services related to plumbing tasks and maintenance"
 *
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 *   get:
 *     summary: Retrieve a list of categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 *
 * /categories/{id}:
 *   get:
 *     summary: Retrieve a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the category
 *     responses:
 *       200:
 *         description: Successfully retrieved the category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Category not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the category
 *     responses:
 *       204:
 *         description: Category successfully deleted
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Category not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
