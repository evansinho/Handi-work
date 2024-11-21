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
 *     summary: Retrieve jobs filtered by status
 *     tags: [Job]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACTIVE, COMPLETED, DISPUTED]
 *         description: Filter jobs by status
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
 *         description: Invalid status parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid status parameter
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while retrieving jobs by status
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
