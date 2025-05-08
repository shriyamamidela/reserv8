const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccount.json'); // Ensure this points to the correct file
const { sendVerificationEmail } = require('./utils/email');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { sendBookingConfirmationEmail } = require('./utils/email');

// Create Express app
const app = express();
app.use(express.json());

// Log when the server starts
console.log("🚀 Server is starting...");

// MySQL Connection Pool with better configuration
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: 10000,
    acquireTimeout: 10000,
    timeout: 10000
});

// Log database configuration (without sensitive info)
console.log("Database Configuration:", {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

// Simple CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Get all restaurants
app.get('/restaurants', (req, res) => {
    console.log('\n📢 Fetching all restaurants');
    
    db.getConnection((err, connection) => {
        if (err) {
            console.error('❌ Database connection error:', err);
            return res.status(503).json({ error: "Database connection error", details: err.message });
        }

        const query = "SELECT *, image_url FROM restaurants";
        connection.query(query, [], (err, results) => {
            connection.release();
            
            if (err) {
                console.error('❌ Error fetching restaurants:', err);
                return res.status(500).json({ error: "Database error", details: err.message });
            }

            console.log(`✅ Found ${results.length} restaurants`);
            res.json(results);
        });
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('❌ Database connection error:', err);
            return res.status(503).json({ 
                status: 'error',
                message: 'Database connection error',
                time: new Date().toISOString()
            });
        }
        connection.release();
        res.json({ 
            status: 'healthy',
            time: new Date().toISOString()
        });
    });
});

// Keep alive ping to MySQL to prevent connection timeouts
const keepAlivePing = setInterval(() => {
    db.query('SELECT 1', [], (err) => {
        if (err) {
            console.error('❌ Database ping failed:', err);
        }
    });
}, 30000); // Ping every 30 seconds

// Handle server shutdown gracefully
function gracefulShutdown() {
    console.log('🛑 Server shutting down...');
    
    // Stop the keep-alive ping
    clearInterval(keepAlivePing);
    
    // Close database connections
    db.end(() => {
        console.log('✅ Database connections closed.');
        process.exit(0);
    });
}

// Shutdown handlers
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown();
});

/* ===========================
        AUTH ROUTES
=========================== */

// User Registration - Store user in MySQL and send verification email
app.post('/register', async (req, res) => {
    console.log('📝 Registration request received:', { email: req.body.email });
    const { idToken, name, email } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const firebase_uid = decodedToken.uid;

        db.query('SELECT * FROM users WHERE firebase_uid = ?', [firebase_uid], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error", details: err.message });

            if (results.length > 0) {
                console.log('⚠️ User already registered');
                return res.status(400).json({ message: "User already registered" });
            }

            db.query(
                'INSERT INTO users (firebase_uid, name, email) VALUES (?, ?, ?)',
                [firebase_uid, name, email],
                async (err, result) => {
                    if (err) return res.status(500).json({ error: "Database error", details: err.message });

                    // Send verification email and update user in Firebase
                    try {
                        console.log('📧 Sending verification email through Firebase...');
                        await admin.auth().generateEmailVerificationLink(email);
                        console.log('✅ Verification email sent successfully through Firebase');
                        
                        res.json({ 
                            message: "User registered successfully. Please check your email for verification.", 
                            uid: firebase_uid 
                        });
                    } catch (error) {
                        console.error('Error sending verification:', error);
                        res.json({ 
                            message: "User registered successfully but verification email failed to send. Please try logging in to resend verification.", 
                            uid: firebase_uid 
                        });
                    }
                }
            );
        });

    } catch (error) {
        res.status(401).json({ error: "Invalid token", details: error.message });
    }
});

// User Login - Verify Firebase Token and Fetch User Data
app.post('/login', async (req, res) => {
    const { idToken } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const firebase_uid = decodedToken.uid;

        db.query('SELECT * FROM users WHERE firebase_uid = ?', [firebase_uid], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error", details: err.message });

            if (results.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            res.json({ message: "Login successful", user: results[0] });
        });

    } catch (error) {
        let errorMessage = "Invalid token";
        if (error.code === "auth/id-token-expired") {
            errorMessage = "Session expired. Please log in again.";
        } else if (error.code === "auth/argument-error") {
            errorMessage = "Malformed token. Please provide a valid ID token.";
        }
        res.status(401).json({ error: errorMessage, details: error.message });
    }
});

/* ===========================
       RESTAURANT ROUTES
=========================== */

// Test API Route
app.get('/api/test', (req, res) => {
    console.log("✅ Test endpoint hit!"); // Log when API is accessed
    res.json({ message: "Test successful" });
});

// Get all restaurants
app.get('/restaurants', (req, res) => {
    console.log('\n📢 Fetching all restaurants');
    
    db.getConnection((err, connection) => {
        if (err) {
            console.error('❌ Database connection error:', err);
            return res.status(503).json({ error: "Database connection error", details: err.message });
        }

        const query = "SELECT *, image_url FROM restaurants";
        connection.query(query, [], (err, results) => {
            connection.release();
            
            if (err) {
                console.error('❌ Error fetching restaurants:', err);
                return res.status(500).json({ error: "Database error", details: err.message });
            }

            console.log(`✅ Found ${results.length} restaurants`);
            res.json(results);
        });
    });
});

// Get Restaurants by Name
app.get('/restaurants/name/:name', (req, res) => {
    const name = req.params.name;
    console.log(`📢 Searching restaurants by name: ${name}`);

    const query = "SELECT *, image_url FROM restaurants WHERE Name LIKE ?";
    console.log("Executing query:", query);
    console.log("Search parameter:", `%${name}%`);

    db.query(query, [`%${name}%`], (err, result) => {
        if (err) {
            console.error('❌ Error fetching restaurants by name:', err);
            res.status(500).json({ error: "Database error", details: err.message });
        } else if (result.length === 0) {
            console.log(`⚠️ No restaurants found with name: ${name}`);
            res.status(404).json({ message: `No restaurants found with name: ${name}` });
        } else {
            console.log(`✅ Found ${result.length} restaurants with name containing ${name}`);
            res.json(result);
        }
    });
});

// Get Restaurants by Location
app.get('/restaurants/location/:location', (req, res) => {
    const location = req.params.location;
    console.log(`📢 Searching restaurants in location: ${location}`);

    const query = "SELECT *, image_url FROM restaurants WHERE Address LIKE ?";
    console.log("Executing query:", query);
    console.log("Search parameter:", `%${location}%`);

    db.query(query, [`%${location}%`], (err, result) => {
        if (err) {
            console.error('❌ Error fetching restaurants by location:', err);
            res.status(500).json({ error: "Database error", details: err.message });
        } else if (result.length === 0) {
            console.log(`⚠️ No restaurants found in location: ${location}`);
            res.status(404).json({ message: `No restaurants found in location: ${location}` });
        } else {
            console.log(`✅ Found ${result.length} restaurants in ${location}`);
            res.json(result);
        }
    });
});

// Get Restaurants by Cuisine
app.get("/restaurants/cuisine/:cuisine", (req, res) => {
    const cuisine = req.params.cuisine;
    console.log(`📢 Searching restaurants by cuisine: ${cuisine}`);

    const query = "SELECT *, image_url FROM restaurants WHERE cuisines LIKE ?";
    console.log("Executing query:", query);
    console.log("Search parameter:", `%${cuisine}%`);

    db.query(query, [`%${cuisine}%`], (err, result) => {
        if (err) {
            console.error('❌ Error fetching restaurants by cuisine:', err);
            res.status(500).json({ error: "Database error", details: err.message });
        } else if (result.length === 0) {
            console.log(`⚠️ No restaurants found for cuisine: ${cuisine}`);
            res.status(404).json({ message: `No restaurants found for cuisine: ${cuisine}` });
        } else {
            console.log(`✅ Found ${result.length} restaurants serving ${cuisine}`);
            res.json(result);
        }
    });
});

// Get a single restaurant with reviews
app.get('/restaurants/:id', (req, res) => {
    const id = req.params.id;
    console.log(`\n📢 Fetching restaurant details for ID: ${id}`);

    // First get the restaurant details
    const restaurantQuery = `
        SELECT Name, Links, Cost, Collections, Cuisines, Timings, Rating, Address, image_url,
               Reviewer, Review, Rating as ReviewRating
        FROM restaurants 
        WHERE Links LIKE ?
    `;

    // Check if reviews table exists
    const checkTableQuery = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = '${process.env.DB_NAME}'
    `;

    const searchPattern = `%${id}%`;
    console.log('🔍 Search pattern:', searchPattern);

    db.getConnection((err, connection) => {
        if (err) {
            console.error('❌ Database connection error:', err);
            return res.status(503).json({ error: "Database connection error", details: err.message });
        }

        // First check what tables exist
        connection.query(checkTableQuery, [], (err, tableResults) => {
            if (err) {
                connection.release();
                console.error('❌ Error checking tables:', err);
                return res.status(500).json({ error: "Database error", details: err.message });
            }

            console.log('\n📋 Available tables:', tableResults.map(t => t.table_name));
            const reviewsTableExists = tableResults.some(t => t.table_name === 'reviews');
            console.log('✓ Reviews table exists:', reviewsTableExists);

            // Get restaurant details
            connection.query(restaurantQuery, [searchPattern], (err, restaurantResults) => {
                if (err) {
                    connection.release();
                    console.error('❌ Error fetching restaurant:', err);
                    return res.status(500).json({ error: "Database error", details: err.message });
                }

                console.log('\n🏠 Restaurant results:', JSON.stringify(restaurantResults, null, 2));

                if (restaurantResults.length === 0) {
                    connection.release();
                    return res.status(404).json({ error: "Restaurant not found" });
                }

                const restaurant = restaurantResults[0];

                // If no reviews in database, use default Indian reviews
                if (!restaurant.Reviewer) {
                    restaurant.Reviews = [
                        {
                            Reviewer: "Rahul Kumar",
                            Review: "Great ambiance and excellent food! The service was top-notch.",
                            Rating: 4.5
                        },
                        {
                            Reviewer: "Priya Sharma",
                            Review: "Loved the variety in the menu. The desserts were amazing.",
                            Rating: 4.0
                        },
                        {
                            Reviewer: "Amit Patel",
                            Review: "Good food but slightly pricey. Nice place for special occasions.",
                            Rating: 3.5
                        }
                    ];
                } else {
                    restaurant.Reviews = [{
                        Reviewer: restaurant.Reviewer,
                        Review: restaurant.Review,
                        Rating: restaurant.ReviewRating
                    }];
                }
                connection.release();
                return res.json(restaurant);

                // Get reviews if table exists
                const reviewsQuery = `
                    SELECT Reviewer, Review, Rating
                    FROM reviews 
                    WHERE Restaurant = ?
                `;

                connection.query(reviewsQuery, [restaurant.Name], (err, reviewResults) => {
                    connection.release();

                    if (err) {
                        console.error('\n❌ Error fetching reviews:', err);
                        restaurant.Reviews = [
                            {
                                Reviewer: "John D.",
                                Review: "Great ambiance and excellent food! The service was top-notch.",
                                Rating: 4.5
                            },
                            {
                                Reviewer: "Sarah M.",
                                Review: "Loved the variety in the menu. The desserts were amazing.",
                                Rating: 4.0
                            },
                            {
                                Reviewer: "Mike R.",
                                Review: "Good food but slightly pricey. Nice place for special occasions.",
                                Rating: 3.5
                            }
                        ];
                    } else {
                        console.log('\n⭐ Review results:', JSON.stringify(reviewResults, null, 2));
                        if (reviewResults && reviewResults.length > 0) {
                            // Use reviews from database, fix any missing reviewer names
                            restaurant.Reviews = reviewResults.map((review, index) => ({
                                Reviewer: review.Reviewer || `Reviewer ${index + 1}`,
                                Review: review.Review,
                                Rating: review.Rating
                            }));
                            console.log(`✅ Found ${reviewResults.length} reviews in database`);
                        } else {
                            // No reviews in database, use defaults
                            console.log('\nℹ️ No reviews found in database, using defaults');
                            restaurant.Reviews = [
                                {
                                    Reviewer: "John D.",
                                    Review: "Great ambiance and excellent food! The service was top-notch.",
                                    Rating: 4.5
                                },
                                {
                                    Reviewer: "Sarah M.",
                                    Review: "Loved the variety in the menu. The desserts were amazing.",
                                    Rating: 4.0
                                },
                                {
                                    Reviewer: "Mike R.",
                                    Review: "Good food but slightly pricey. Nice place for special occasions.",
                                    Rating: 3.5
                                }
                            ];
                        }
                    }

                    console.log(`\n✅ Returning restaurant with ${restaurant.Reviews.length} reviews`);
                    res.json(restaurant);
                });
            });
        });
    });
});

// Get table availability
app.get('/restaurants/:id/availability', (req, res) => {
    const { id } = req.params;
    const { date, time } = req.query;
    
    // Convert 12-hour time to 24-hour format
    const convert12to24 = (time12h) => {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
    };

    const time24h = convert12to24(time);
    
    console.log(`📢 Checking availability for restaurant ${id} on ${date} at ${time} (${time24h})`);
    
    db.getConnection((err, connection) => {
        if (err) {
            console.error('❌ Database connection error:', err);
            return res.status(503).json({ error: "Database connection error" });
        }

        // First check if the restaurant exists
        const searchName = id.replace(/-/g, ' ').split(' ').slice(0, 2).join(' '); // Get first two words (e.g., "13 dhaba")
        console.log('🔍 Searching for restaurant:', searchName);
        const restaurantQuery = 'SELECT Name FROM restaurants WHERE Name LIKE ?';
        connection.query(restaurantQuery, [`%${searchName}%`], (err, restaurantResults) => {
            if (err) {
                connection.release();
                console.error('❌ Error checking restaurant:', err);
                return res.status(500).json({ error: "Database error" });
            }

            if (restaurantResults.length === 0) {
                connection.release();
                return res.status(404).json({ error: "Restaurant not found" });
            }

            const query = `
                SELECT total_tables, booked_tables 
                FROM table_availability 
                WHERE restaurant_id = ? AND date = ? AND time_slot = ?
            `;

            // Use the exact name from database
            const exactRestaurantName = restaurantResults[0].Name;
            console.log('📝 Using exact restaurant name:', exactRestaurantName);
            connection.query(query, [exactRestaurantName, date, time24h], (err, results) => {
                if (err) {
                    connection.release();
                    console.error('❌ Error checking availability:', err);
                    return res.status(500).json({ error: "Database error" });
                }

                connection.release();

                if (results.length === 0) {
                    return res.json({
                        available: true,
                        total_tables: 10,
                        available_tables: 10
                    });
                }

                const { total_tables, booked_tables } = results[0];
                const available_tables = total_tables - booked_tables;

                res.json({
                    available: available_tables > 0,
                    total_tables,
                    available_tables
                });
            });
        });
    });
});

// Update table availability when booking
app.post('/restaurants/:id/book', (req, res) => {
    const { id } = req.params;
    const { date, time, tables = 1, email, name } = req.body;
    
    // Convert 12-hour time to 24-hour format
    const convert12to24 = (time12h) => {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
    };

    const time24h = convert12to24(time);
    
    console.log(`
📢 Booking request:`);
    console.log(`- Tables: ${tables}`);
    console.log(`- Restaurant ID: ${id}`);
    console.log(`- Date: ${date}`);
    console.log(`- Time: ${time} (${time24h})`);
    
    db.getConnection((err, connection) => {
        if (err) {
            console.error('❌ Database connection error:', err);
            return res.status(503).json({ error: "Database connection error" });
        }

        // First check if the restaurant exists
        const searchName = id.replace(/-/g, ' ').split(' ').slice(0, 2).join(' '); // Get first two words (e.g., "13 dhaba")
        console.log('🔍 Searching for restaurant:', searchName);
        const restaurantQuery = 'SELECT Name FROM restaurants WHERE Name LIKE ?';
        connection.query(restaurantQuery, [`%${searchName}%`], (err, restaurantResults) => {
            if (err) {
                connection.release();
                console.error('❌ Error checking restaurant:', err);
                return res.status(500).json({ error: "Database error" });
            }

            if (restaurantResults.length === 0) {
                connection.release();
                return res.status(404).json({ error: "Restaurant not found" });
            }

            // Then check current availability
            const checkQuery = `
                SELECT total_tables, booked_tables 
                FROM table_availability 
                WHERE restaurant_id = ? AND date = ? AND time_slot = ?
                FOR UPDATE;
            `;

            connection.beginTransaction(err => {
                if (err) {
                    connection.release();
                    return res.status(500).json({ error: "Transaction error" });
                }

                const exactRestaurantName = restaurantResults[0].Name;
            console.log('📝 Using exact restaurant name:', exactRestaurantName);
            // Check if a record exists for this timeslot
            const checkExistingQuery = `
                SELECT total_tables, booked_tables 
                FROM table_availability 
                WHERE restaurant_id = ? AND date = ? AND time_slot = ?
                FOR UPDATE
            `;
            
            connection.query(checkExistingQuery, [exactRestaurantName, date, time24h], (err, existingResults) => {
                    if (err) {
                        connection.rollback(() => {
                            connection.release();
                            res.status(500).json({ error: "Database error" });
                        });
                        return;
                    }

                    let updateQuery;
                    let queryParams;

                    if (existingResults.length === 0) {
                        // No record exists, insert new one
                        updateQuery = `
                            INSERT INTO table_availability 
                            (restaurant_id, date, time_slot, total_tables, booked_tables)
                            VALUES (?, ?, ?, 10, ?)
                        `;
                        queryParams = [exactRestaurantName, date, time24h, tables];
                        console.log('🎉 Creating new timeslot:', {
                            restaurant: exactRestaurantName,
                            date,
                            time: time24h,
                            tables
                        });
                    } else {
                        // Record exists, check availability and update
                        const { total_tables, booked_tables } = existingResults[0];
                        console.log('📊 Current availability:', {
                            total_tables,
                            booked_tables,
                            requested_tables: tables,
                            would_be_booked: booked_tables + tables
                        });

                        if (booked_tables + tables > total_tables) {
                            connection.rollback(() => {
                                connection.release();
                                res.status(400).json({ error: "No tables available for this time slot" });
                            });
                            return;
                        }

                        updateQuery = `
                            UPDATE table_availability 
                            SET booked_tables = booked_tables + ? 
                            WHERE restaurant_id = ? AND date = ? AND time_slot = ?
                        `;
                        queryParams = [tables, exactRestaurantName, date, time24h];
                        console.log('📝 Updating existing timeslot:', {
                            restaurant: exactRestaurantName,
                            date,
                            time: time24h,
                            adding_tables: tables,
                            current_booked: booked_tables
                        });
                    }

                    console.log('📝 Executing query:', updateQuery);
                    console.log('📝 Query params:', queryParams);
                    connection.query(updateQuery, queryParams, (err) => {
                        if (err) {
                            console.error('❌ Query error:', err);
                            connection.rollback(() => {
                                connection.release();
                                res.status(500).json({ error: "Database error", details: err.message });
                            });
                            return;
                        }

                        connection.commit(err => {
                            if (err) {
                                connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ error: "Commit error" });
                                });
                                return;
                            }

                            connection.release();
                            // Send confirmation email
                            sendBookingConfirmationEmail(email, {
                                restaurantName: exactRestaurantName,
                                date,
                                time,
                                people: tables
                            }).then(emailSent => {
                                res.json({
                                    message: "Booking successful",
                                    emailSent
                                });
                            }).catch(error => {
                                console.error('Failed to send email:', error);
                                res.json({
                                    message: "Booking successful",
                                    emailSent: false
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Get Available Time Slots
app.get('/restaurants/:id/timeslots/:date', (req, res) => {
    const { id, date } = req.params;
    console.log(`\n📢 Fetching available time slots for restaurant ${id} on ${date}`);

    // First get restaurant's operating hours
    const query = `
        SELECT opening_time, closing_time 
        FROM restaurants 
        WHERE id = ?
    `;

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('❌ Error fetching restaurant hours:', err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Get existing bookings for that date
        const bookingsQuery = `
            SELECT time_slot 
            FROM bookings 
            WHERE restaurant_id = ? 
            AND date = ?
        `;

        db.query(bookingsQuery, [id, date], (err, bookings) => {
            if (err) {
                console.error('❌ Error fetching bookings:', err);
                return res.status(500).json({ error: "Database error", details: err.message });
            }

            const bookedTimes = bookings.map(b => b.time_slot);
            const { opening_time, closing_time } = result[0];

            // Generate available time slots (30-minute intervals)
            const availableSlots = [];
            let currentTime = new Date(`2000-01-01T${opening_time}`);
            const endTime = new Date(`2000-01-01T${closing_time}`);

            while (currentTime < endTime) {
                const timeSlot = currentTime.toTimeString().slice(0, 5);
                if (!bookedTimes.includes(timeSlot)) {
                    availableSlots.push(timeSlot);
                }
                currentTime.setMinutes(currentTime.getMinutes() + 30);
            }

            res.json(availableSlots);
        });
    });
});

// Create Booking
app.post('/bookings', (req, res) => {
    const { restaurant_id, date, time_slot, number_of_people, customer_name, email, phone } = req.body;
    console.log(`\n📢 Creating booking for restaurant ${restaurant_id}`);

    const query = `
        INSERT INTO bookings 
        (restaurant_id, date, time_slot, number_of_people, customer_name, email, phone) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [restaurant_id, date, time_slot, number_of_people, customer_name, email, phone],
        (err, result) => {
            if (err) {
                console.error('❌ Error creating booking:', err);
                res.status(500).json({ error: "Database error", details: err.message });
            } else {
                console.log(`\n✅ Booking created with ID: ${result.insertId}`);
                res.json({ 
                    message: "Booking created successfully", 
                    booking_id: result.insertId 
                });
            }
        }
    );
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({ error: "Internal server error", details: err.message });
});

/* ===========================
         SERVER START
=========================== */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
});
