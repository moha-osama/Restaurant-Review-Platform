import prisma from "../src/lib/client.js";

async function main() {
    try {

        console.log("🌱 Generating dummy data...");
        
        // Create users
        const users = await Promise.all([
            prisma.user.create({
                data: {
                    name: "Alice Johnson",
                    email: "alice@example.com",
                    password: "Zz1122medo##", 
                    role: "user",
                    tokens: []
                }
            }),
            prisma.user.create({
                data: {
                    name: "Bob Smith",
                    email: "bob@example.com",
                    password: "Zz1122medo##",
                    role: "owner",
                    tokens: []
                }
            }),
            prisma.user.create({
                data: {
                    name: "Charlie Davis",
                    email: "charlie@example.com",
                    password: "Zz1122medo##",
                    role: "admin",
                    tokens: []
                }
            }),
            prisma.user.create({
                data: {
                    name: "Diana Wilson",
                    email: "diana@example.com",
                    password: "Zz1122medo##",
                    role: "user",
                    tokens: []
                }
            }),
            prisma.user.create({
                data: {
                    name: "Eve Brown",
                    email: "eve@example.com",
                    password: "Zz1122medo##",
                    role: "owner",
                    tokens: []
                }
            })
        ]);
        
        console.log(`✅ Created ${users.length} users`);
        
        // Create restaurants
        const restaurants = await Promise.all([
            prisma.restaurant.create({
                data: {
                    owner_id: users[1].id, // Bob Smith (owner)
                    name: "Burger Haven",
                    location: "New York, NY",
                    description: "Best burgers in town with fresh ingredients and amazing flavors. Our secret sauce makes all the difference!",
                    avg_rating: 4.5,
                    avg_sentiment: 0.8
                }
            }),
            prisma.restaurant.create({
                data: {
                    owner_id: users[1].id, // Bob Smith (owner)
                    name: "Sushi World",
                    location: "Los Angeles, CA",
                    description: "Authentic Japanese sushi experience with fresh fish flown in daily. Traditional techniques meet modern presentation.",
                    avg_rating: 3.2,
                    avg_sentiment: 0.4
                }
            }),
            prisma.restaurant.create({
                data: {
                    owner_id: users[1].id, // Bob Smith (owner)
                    name: "Tandoori Flames",
                    location: "Chicago, IL",
                    description: "Traditional Indian cuisine with a modern twist. Spices imported directly from India for authentic taste.",
                    avg_rating: 4.8,
                    avg_sentiment: 0.9
                }
            }),
            prisma.restaurant.create({
                data: {
                    owner_id: users[4].id, // Eve Brown (owner)
                    name: "Pizza Palace",
                    location: "Miami, FL",
                    description: "Artisanal pizzas with hand-tossed dough and premium toppings. Wood-fired ovens for that perfect crust.",
                    avg_rating: 4.1,
                    avg_sentiment: 0.7
                }
            }),
            prisma.restaurant.create({
                data: {
                    owner_id: users[4].id, // Eve Brown (owner)
                    name: "Taco Fiesta",
                    location: "Austin, TX",
                    description: "Authentic Mexican street tacos with homemade tortillas and fresh salsa. A fiesta of flavors in every bite!",
                    avg_rating: 4.3,
                    avg_sentiment: 0.6
                }
            })
        ]);
        
        console.log(`✅ Created ${restaurants.length} restaurants`);
        
        // Create reviews
        const reviews = await Promise.all([
            // Reviews for Burger Haven
            prisma.review.create({
                data: {
                    restaurant_id: restaurants[0].id,
                    user_id: users[0].id, // Alice
                    rating: 5.0,
                    sentiment: 0.9,
                    comment: "Amazing burgers! The secret sauce is incredible. Will definitely come back!"
                }
            }),
            prisma.review.create({
                data: {
                    restaurant_id: restaurants[0].id,
                    user_id: users[2].id, // Charlie
                    rating: 4.0,
                    sentiment: 0.7,
                    comment: "Great food and atmosphere. The fries were perfectly crispy."
                }
            }),
            prisma.review.create({
                data: {
                    restaurant_id: restaurants[0].id,
                    user_id: users[3].id, // Diana
                    rating: 4.5,
                    sentiment: 0.8,
                    comment: "Best burger joint in NYC! Fresh ingredients and friendly staff."
                }
            }),
            
            // Reviews for Sushi World
            prisma.review.create({
                data: {
                    restaurant_id: restaurants[1].id,
                    user_id: users[0].id, // Alice
                    rating: 3.0,
                    sentiment: 0.3,
                    comment: "Decent sushi but a bit pricey for the quality."
                }
            }),
            prisma.review.create({
                data: {
                    restaurant_id: restaurants[1].id,
                    user_id: users[2].id, // Charlie
                    rating: 3.5,
                    sentiment: 0.5,
                    comment: "Good traditional sushi. The fish was fresh but portions were small."
                }
            }),
            
            // Reviews for Tandoori Flames
            prisma.review.create({
                data: {
                    restaurant_id: restaurants[2].id,
                    user_id: users[0].id, // Alice
                    rating: 5.0,
                    sentiment: 0.95,
                    comment: "Absolutely fantastic! The spices are incredible and the naan is perfect."
                }
            }),
            prisma.review.create({
                data: {
                    restaurant_id: restaurants[2].id,
                    user_id: users[3].id, // Diana
                    rating: 4.5,
                    sentiment: 0.85,
                    comment: "Amazing Indian food! The butter chicken is to die for."
                }
            }),
            
            // Reviews for Pizza Palace
            prisma.review.create({
                data: {
                    restaurant_id: restaurants[3].id,
                    user_id: users[0].id, // Alice
                    rating: 4.0,
                    sentiment: 0.7,
                    comment: "Great pizza with a crispy crust. The margherita is classic and delicious."
                }
            }),
            prisma.review.create({
                data: {
                    restaurant_id: restaurants[3].id,
                    user_id: users[2].id, // Charlie
                    rating: 4.2,
                    sentiment: 0.75,
                    comment: "Excellent wood-fired pizza. The toppings are fresh and the cheese is perfect."
                }
            }),
            
            // Reviews for Taco Fiesta
            prisma.review.create({
                data: {
                    restaurant_id: restaurants[4].id,
                    user_id: users[0].id, // Alice
                    rating: 4.5,
                    sentiment: 0.8,
                    comment: "Authentic Mexican flavors! The street tacos are amazing and the salsa is perfect."
                }
            }),
            prisma.review.create({
                data: {
                    restaurant_id: restaurants[4].id,
                    user_id: users[3].id, // Diana
                    rating: 4.0,
                    sentiment: 0.6,
                    comment: "Great tacos and friendly service. The homemade tortillas make all the difference."
                }
            })
        ]);
        
        console.log(`✅ Created ${reviews.length} reviews`);
        
        console.log("🎉 Seed data generation completed successfully!");
        console.log(`📊 Summary: ${users.length} users, ${restaurants.length} restaurants, ${reviews.length} reviews`);
        
    } catch (error) {
        console.error("❌ Error during seeding:", error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });