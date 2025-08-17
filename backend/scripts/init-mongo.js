// MongoDB initialization script for SpeedMotors
// This script runs when the MongoDB container starts for the first time

db = db.getSiblingDB('speedmotors');

// Create collections
db.createCollection('users');
db.createCollection('vehicles');
db.createCollection('sales');
db.createCollection('service');
db.createCollection('inventory');
db.createCollection('customers');
db.createCollection('technicians');
db.createCollection('suppliers');
db.createCollection('analytics');
db.createCollection('notifications');
db.createCollection('payments');
db.createCollection('reports');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "department": 1 });
db.users.createIndex({ "isActive": 1 });
db.users.createIndex({ "createdAt": -1 });

db.vehicles.createIndex({ "vin": 1 }, { unique: true });
db.vehicles.createIndex({ "make": 1 });
db.vehicles.createIndex({ "model": 1 });
db.vehicles.createIndex({ "year": 1 });
db.vehicles.createIndex({ "status": 1 });

db.sales.createIndex({ "customerId": 1 });
db.sales.createIndex({ "vehicleId": 1 });
db.sales.createIndex({ "salesAgentId": 1 });
db.sales.createIndex({ "status": 1 });
db.sales.createIndex({ "createdAt": -1 });

db.service.createIndex({ "customerId": 1 });
db.service.createIndex({ "vehicleId": 1 });
db.service.createIndex({ "technicianId": 1 });
db.service.createIndex({ "status": 1 });
db.service.createIndex({ "scheduledDate": 1 });

db.inventory.createIndex({ "partNumber": 1 }, { unique: true });
db.inventory.createIndex({ "category": 1 });
db.inventory.createIndex({ "supplierId": 1 });
db.inventory.createIndex({ "stockLevel": 1 });
db.inventory.createIndex({ "lastUpdated": -1 });

db.customers.createIndex({ "email": 1 });
db.customers.createIndex({ "phone": 1 });
db.customers.createIndex({ "status": 1 });
db.customers.createIndex({ "createdAt": -1 });

db.technicians.createIndex({ "employeeId": 1 }, { unique: true });
db.technicians.createIndex({ "specialization": 1 });
db.technicians.createIndex({ "isAvailable": 1 });

db.suppliers.createIndex({ "name": 1 });
db.suppliers.createIndex({ "category": 1 });
db.suppliers.createIndex({ "status": 1 });

db.analytics.createIndex({ "type": 1 });
db.analytics.createIndex({ "date": 1 });
db.analytics.createIndex({ "createdAt": -1 });

db.notifications.createIndex({ "userId": 1 });
db.notifications.createIndex({ "type": 1 });
db.notifications.createIndex({ "isRead": 1 });
db.notifications.createIndex({ "createdAt": -1 });

db.payments.createIndex({ "customerId": 1 });
db.payments.createIndex({ "transactionId": 1 }, { unique: true });
db.payments.createIndex({ "status": 1 });
db.payments.createIndex({ "createdAt": -1 });

db.reports.createIndex({ "type": 1 });
db.reports.createIndex({ "generatedBy": 1 });
db.reports.createIndex({ "createdAt": -1 });

// Create admin user if it doesn't exist
const adminUser = db.users.findOne({ "email": "admin@speedmotors.com" });

if (!adminUser) {
  print("Creating admin user...");
  
  // Note: In production, this should be a secure password
  // For development, we'll use a simple one
  db.users.insertOne({
    firstName: "Admin",
    lastName: "User",
    email: "admin@speedmotors.com",
    phone: "+1234567890",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/vHhHwqG", // "admin123"
    role: "admin",
    department: "admin",
    employeeId: "ADM000001",
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      language: "en",
      timezone: "UTC"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  print("Admin user created successfully");
} else {
  print("Admin user already exists");
}

// Create sample data for development
if (process.env.NODE_ENV === 'development') {
  print("Creating sample data for development...");
  
  // Sample vehicles
  if (db.vehicles.countDocuments() === 0) {
    db.vehicles.insertMany([
      {
        make: "Toyota",
        model: "Camry",
        year: 2023,
        vin: "1HGBH41JXMN109186",
        color: "White",
        mileage: 15000,
        price: 25000,
        status: "available",
        features: ["Bluetooth", "Backup Camera", "Lane Assist"],
        images: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        make: "Honda",
        model: "Civic",
        year: 2023,
        vin: "2T1BURHE0JC123456",
        color: "Blue",
        mileage: 12000,
        price: 22000,
        status: "available",
        features: ["Apple CarPlay", "Android Auto", "Safety Sense"],
        images: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    print("Sample vehicles created");
  }
  
  // Sample customers
  if (db.customers.countDocuments() === 0) {
    db.customers.insertMany([
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1234567891",
        address: {
          street: "123 Main St",
          city: "Anytown",
          state: "CA",
          zipCode: "12345",
          country: "US"
        },
        preferences: {
          notifications: {
            email: true,
            sms: true,
            push: false
          }
        },
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    print("Sample customers created");
  }
  
  // Sample technicians
  if (db.technicians.countDocuments() === 0) {
    db.technicians.insertMany([
      {
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike.johnson@speedmotors.com",
        phone: "+1234567892",
        employeeId: "TEC000001",
        specialization: "Engine Repair",
        experience: "5 years",
        certifications: ["ASE Certified", "Toyota Certified"],
        isAvailable: true,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    print("Sample technicians created");
  }
  
  print("Sample data creation completed");
}

print("MongoDB initialization completed successfully!");
