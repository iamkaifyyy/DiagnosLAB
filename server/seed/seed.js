const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../models/User');
const Lab = require('../models/Lab');
const Test = require('../models/Test');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Hospital = require('../models/Hospital');
const { calculateTrustScore } = require('../utils/trustScore');

// Random helper functions
const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloatInRange = (min, max, precision = 1) => parseFloat((Math.random() * (max - min) + min).toFixed(precision));
const randomSelect = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomShuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata'];
const areas = {
  'Delhi': ['Connaught Place', 'Dwarka', 'Rohini', 'Saket', 'Karol Bagh', 'Vasant Kunj'],
  'Mumbai': ['Andheri West', 'Bandra', 'Colaba', 'Juhu', 'Borivali', 'Dadar'],
  'Bangalore': ['Koramangala', 'HSR Layout', 'Indiranagar', 'Jayanagar', 'Whitefield', 'Electronic City'],
  'Chennai': ['Adyar', 'T. Nagar', 'Velachery', 'Mylapore', 'Anna Nagar'],
  'Pune': ['Kothrud', 'Koregaon Park', 'Viman Nagar', 'Hinjewadi', 'Shivajinagar'],
  'Hyderabad': ['Gachibowli', 'Jubilee Hills', 'Banjara Hills', 'Madhapur', 'Secunderabad'],
  'Kolkata': ['Salt Lake', 'Park Street', 'New Town', 'Gariahat', 'Ballygunge']
};

const labNames = [
  'Apex Diagnostics', 'Metropolis Pathlabs', 'Sunrise Medical Labs', 'Blue Shield Diagnostics',
  'CarePath Diagnostics', 'Vision Pathology Lab', 'Helix Diagnostics', 'Lal PathLabs',
  'SRL Diagnostics', 'Apollo Diagnostics', 'Thyrocare Centre', 'Suburban Pathology',
  'Medall Health Center', 'Suraksha Labs', 'Max Healthcare Diagnostics', 'Fortis Pathlab'
];

const labImages = [
  'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1584036561566-baf245fdb26a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1579154204601-01588f35116f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1579684275623-0090001d25bc?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1579684453423-f84349ef1a2e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1504813184591-015578f7c975?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1579684389824-c18ec6222b4f?auto=format&fit=crop&w=600&q=80'
];

const testPool = [
  { testName: 'Complete Blood Count (CBC)', category: 'Hematology', basePrice: 350, baseTime: 6, description: 'Measures red & white blood cells, hemoglobin, and platelets for general health screen.' },
  { testName: 'Lipid Profile', category: 'Biochemistry', basePrice: 600, baseTime: 12, description: 'Measures cholesterol, triglycerides, HDL, and LDL levels to assess cardiovascular risk.' },
  { testName: 'Thyroid Profile (T3, T4, TSH)', category: 'Endocrinology', basePrice: 800, baseTime: 24, description: 'Complete thyroid function assessment to evaluate metabolic balance.' },
  { testName: 'HbA1c', category: 'Diabetes', basePrice: 500, baseTime: 12, description: 'Evaluates your average blood sugar level over the past 3 months.' },
  { testName: 'Liver Function Test (LFT)', category: 'Biochemistry', basePrice: 700, baseTime: 12, description: 'Checks SGOT, SGPT, bilirubin, and albumin levels to analyze liver performance.' },
  { testName: 'Kidney Function Test (KFT)', category: 'Biochemistry', basePrice: 650, baseTime: 12, description: 'Checks creatinine, blood urea nitrogen, and uric acid levels.' },
  { testName: 'Vitamin D (25-Hydroxy)', category: 'Vitamins', basePrice: 950, baseTime: 24, description: 'Measures body vitamin D level for bone and immune support evaluation.' },
  { testName: 'Vitamin B12', category: 'Vitamins', basePrice: 750, baseTime: 24, description: 'Determines serum vitamin B12 levels, critical for nervous system health.' },
  { testName: 'COVID-19 RT-PCR Test', category: 'Molecular', basePrice: 500, baseTime: 18, description: 'Molecular test for qualitative detection of active SARS-CoV-2 infection.' },
  { testName: 'Urine Routine Analysis', category: 'Pathology', basePrice: 200, baseTime: 6, description: 'Routine check of urine physical and chemical properties to spot infections.' },
  { testName: 'Blood Glucose Fasting', category: 'Diabetes', basePrice: 150, baseTime: 4, description: 'Measures blood glucose concentration after an 8 to 12-hour fast.' },
  { testName: 'Iron Profile Test', category: 'Biochemistry', basePrice: 750, baseTime: 18, description: 'Measures serum iron, ferritin, and total iron-binding capacity.' },
  { testName: 'Cardiac Markers Panel', category: 'Cardiology', basePrice: 2200, baseTime: 12, description: 'Evaluates troponin, CK-MB, and LDH for potential cardiac muscle strain.' },
  { testName: 'Dengue NS1 Antigen', category: 'Microbiology', basePrice: 650, baseTime: 8, description: 'Detects Dengue virus infection in its early phase.' },
  { testName: 'Full Body Health Screening', category: 'Packages', basePrice: 2999, baseTime: 24, description: 'Comprehensive package containing 70+ essential tests (CBC, LFT, KFT, Lipids).' },
  { testName: 'Genetic Health Risk Assessment', category: 'Genetics', basePrice: 9999, baseTime: 120, description: 'Advanced screening analyzing hereditary factors for 30+ chronic conditions.' }
];

const patientReviewComments = [
  'Absolutely brilliant service. The home collector arrived on time, was very gentle, and reports came 4 hours early.',
  'Decent service, but the waiting room at the clinic was a bit crowded. Test results were accurate.',
  'My doctor recommended this lab, and they proved to be highly professional. Rates are reasonable too.',
  'Average experience. Main issue was that report was delayed by about 6 hours. But test was done well.',
  'Amazing diagnostics center! High-tech machinery, neat and tidy, and super helpful receptionists.',
  'Quick and hassle-free. Booked in the morning, collection done by noon, and reports on my email in evening.',
  'Budget-friendly, but communication could be improved. The report was correct though.',
  'Excellent pathology lab. Their report structure is very clear, making it easy to read.',
  'Very professional phlebotomist. Did not feel any pain. Highly recommended.',
  'Satisfied with the service. Will use them again.'
];

const seedDB = async (skipConnect = false) => {
  try {
    if (!skipConnect) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB for seeding...');
    }

    // Clear existing data
    await User.deleteMany({});
    await Lab.deleteMany({});
    await Test.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Hospital.deleteMany({});
    console.log('Cleared existing database tables.');

    // 1. Create Users
    const hashedPw = await bcrypt.hash('password123', 10);
    
    const patientsData = [
      { name: 'Amit Sharma', email: 'patient@demo.com', password: hashedPw, role: 'patient', phone: '9823412345', city: 'Delhi' },
      { name: 'Priya Patel', email: 'patient2@demo.com', password: hashedPw, role: 'patient', phone: '9812345678', city: 'Mumbai' },
      { name: 'Karthik Raja', email: 'patient3@demo.com', password: hashedPw, role: 'patient', phone: '9745612345', city: 'Chennai' },
      { name: 'Ritu Sen', email: 'patient4@demo.com', password: hashedPw, role: 'patient', phone: '9612348765', city: 'Kolkata' },
      { name: 'Siddharth Rao', email: 'patient5@demo.com', password: hashedPw, role: 'patient', phone: '9512346789', city: 'Bangalore' }
    ];

    const doctorsData = [
      { name: 'Dr. Alok Mehta', email: 'doctor@demo.com', password: hashedPw, role: 'doctor', phone: '9012345678', city: 'Delhi' },
      { name: 'Dr. Sunita Deshmukh', email: 'doctor2@demo.com', password: hashedPw, role: 'doctor', phone: '9023456789', city: 'Mumbai' },
      { name: 'Dr. Ravi Kumar', email: 'doctor3@demo.com', password: hashedPw, role: 'doctor', phone: '9034567890', city: 'Bangalore' }
    ];

    const labUsersData = labNames.map((name, index) => ({
      name,
      email: `lab${index + 1}@demo.com`,
      password: hashedPw,
      role: 'lab',
      phone: `99${index.toString().padStart(8, '0')}`,
      city: randomSelect(cities)
    }));

    const hospitalUsersData = [
      { name: 'Apollo Multispeciality', email: 'hospital@demo.com', password: hashedPw, role: 'hospital', phone: '9456123456', city: 'Delhi' },
      { name: 'Fortis Healthcare', email: 'hospital2@demo.com', password: hashedPw, role: 'hospital', phone: '9456789012', city: 'Mumbai' }
    ];

    const allUsersData = [...patientsData, ...doctorsData, ...labUsersData, ...hospitalUsersData];
    const createdUsers = await User.insertMany(allUsersData);
    console.log(`✅ Created ${createdUsers.length} user accounts.`);

    const patients = createdUsers.filter(u => u.role === 'patient');
    const doctors = createdUsers.filter(u => u.role === 'doctor');
    const labAccounts = createdUsers.filter(u => u.role === 'lab');
    const hospitalAccounts = createdUsers.filter(u => u.role === 'hospital');

    // 2. Create Labs
    const createdLabs = [];
    const accOptions = [['NABL'], ['NABL', 'CAP'], ['NABL', 'ISO 15189'], [], ['CAP']];

    for (let i = 0; i < labAccounts.length; i++) {
      const user = labAccounts[i];
      const city = user.city;
      const area = randomSelect(areas[city]);
      const image = labImages[i % labImages.length];

      const labDoc = await Lab.create({
        name: user.name,
        description: `${user.name} is a state-of-the-art diagnostics facility in ${city}. Equipped with advanced medical analyzers and managed by expert pathologists, we guarantee prompt and precise results.`,
        location: {
          city,
          area,
          address: `${randomInRange(10, 200)}, Main Road, Near Central Square, ${area}, ${city}`
        },
        trustScore: randomInRange(40, 96), // Random initial trust score
        ratings: randomFloatInRange(3.2, 4.9, 1),
        totalReviews: randomInRange(15, 230),
        reportConsistency: randomFloatInRange(3.0, 5.0, 1),
        accreditedBy: randomSelect(accOptions),
        homeCollection: Math.random() > 0.25, // 75% support home collection
        operatingHours: `${randomSelect(['6:00 AM', '7:00 AM', '8:00 AM'])} - ${randomSelect(['8:00 PM', '9:00 PM', '10:00 PM', '24/7'])}`,
        phone: user.phone,
        email: `info@${user.name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
        image,
        doctorRecommendations: randomInRange(0, 70),
        hospitalRecommendations: randomInRange(0, 20),
        userId: user._id
      });
      createdLabs.push(labDoc);
    }
    console.log(`✅ Created ${createdLabs.length} diagnostics labs with medical cover images.`);

    // 3. Create Tests (with random prices and parameters)
    const createdTests = [];
    for (const lab of createdLabs) {
      // Pick 8 to 12 random tests from the test pool
      const selectedTests = randomShuffle(testPool).slice(0, randomInRange(8, 12));
      for (const t of selectedTests) {
        // Price variation: base price +/- 20% rounded to nearest 10
        const pct = randomInRange(-20, 25);
        const rawPrice = t.basePrice * (1 + pct / 100);
        const finalPrice = Math.round(rawPrice / 10) * 10;
        
        // Report time: base time +/- 4 hours (minimum 4h)
        const finalTime = Math.max(4, t.baseTime + randomInRange(-4, 8));

        const testDoc = await Test.create({
          testName: t.testName,
          category: t.category,
          price: finalPrice,
          labId: lab._id,
          reportTime: finalTime,
          description: t.description,
          popular: Math.random() > 0.6 // 40% are popular
        });
        createdTests.push(testDoc);
      }
    }
    console.log(`✅ Created ${createdTests.length} randomized laboratory tests.`);

    // 4. Create Reviews & Recalculate Trust Scores
    const createdReviews = [];
    for (const lab of createdLabs) {
      // Assign 3 to 5 random reviews (no more than patients count)
      const reviewCount = randomInRange(3, Math.min(5, patients.length));
      const reviewsForLab = [];
      const usedPatients = new Set();
      
      for (let j = 0; j < reviewCount; j++) {
        let patient = null;
        let attempts = 0;
        while (attempts < 20) {
          const candidate = randomSelect(patients);
          if (!usedPatients.has(candidate._id.toString())) {
            patient = candidate;
            usedPatients.add(candidate._id.toString());
            break;
          }
          attempts++;
        }
        
        if (!patient) continue;

        const rating = randomInRange(3, 5);
        const accuracyScore = randomInRange(Math.max(1, rating - 1), Math.min(5, rating + 1));
        const comment = randomSelect(patientReviewComments);

        const revDoc = await Review.create({
          userId: patient._id,
          labId: lab._id,
          rating,
          accuracyScore,
          comment
        });
        reviewsForLab.push(revDoc);
        createdReviews.push(revDoc);
      }

      // Calculate trust score based on our formula
      const avgRating = reviewsForLab.reduce((sum, r) => sum + r.rating, 0) / reviewsForLab.length;
      const avgAccuracy = reviewsForLab.reduce((sum, r) => sum + r.accuracyScore, 0) / reviewsForLab.length;
      
      const drNorm = Math.min(lab.doctorRecommendations / 10, 5);
      const hrNorm = Math.min(lab.hospitalRecommendations / 5, 5);

      const computedTrust = calculateTrustScore({
        rating: avgRating,
        accuracy: avgAccuracy,
        doctorRec: drNorm,
        hospitalRec: hrNorm,
        consistency: lab.reportConsistency
      });

      lab.trustScore = computedTrust;
      lab.ratings = parseFloat(avgRating.toFixed(1));
      lab.totalReviews = reviewsForLab.length;
      await lab.save();
    }
    console.log(`✅ Created ${createdReviews.length} verified reviews and updated trust scores.`);

    // 5. Create Bookings
    const bookingData = [];
    // Create 5 random bookings in the system
    for (let k = 0; k < 5; k++) {
      const patient = randomSelect(patients);
      const randomTest = randomSelect(createdTests);
      const labOfTest = createdLabs.find(l => l._id.equals(randomTest.labId));
      
      const dateOffset = randomInRange(-5, 10);
      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() + dateOffset);

      const statusOptions = ['booked', 'sample_collected', 'testing', 'report_ready', 'delivered'];
      const status = randomSelect(statusOptions);

      // Create tracking updates
      const trackingUpdates = [];
      const statusIdx = statusOptions.indexOf(status);
      for (let sIdx = 0; sIdx <= statusIdx; sIdx++) {
        const updateDate = new Date(bookingDate);
        updateDate.setHours(updateDate.getHours() + sIdx * 3);
        trackingUpdates.push({
          status: statusOptions[sIdx],
          timestamp: updateDate,
          note: `Booking status changed to ${statusOptions[sIdx]}`
        });
      }

      const bookingDoc = await Booking.create({
        userId: patient._id,
        labId: labOfTest._id,
        testId: randomTest._id,
        status,
        timeSlot: randomSelect(['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM']),
        date: bookingDate,
        homeCollection: labOfTest.homeCollection && Math.random() > 0.3,
        address: patient.city ? `Street #${randomInRange(1, 40)}, ${patient.city}` : 'Flat 404, Park Heights',
        totalAmount: randomTest.price,
        trackingUpdates
      });
      bookingData.push(bookingDoc);
    }
    console.log(`✅ Created ${bookingData.length} mock test bookings.`);

    // 6. Create Hospitals & Doctor Recommendations
    await Hospital.create({
      name: 'Apollo Multispeciality Hospital',
      address: 'Sarita Vihar, Mathura Road, New Delhi - 110076',
      city: 'Delhi',
      phone: '011-71791090',
      doctors: [doctors[0]._id],
      recommendedLabs: [createdLabs[0]._id, createdLabs[1]._id],
      userId: hospitalAccounts[0]._id
    });

    await Hospital.create({
      name: 'Fortis Healthcare Center',
      address: 'Mulund West, Mumbai - 400080',
      city: 'Mumbai',
      phone: '022-56267500',
      doctors: [doctors[1]._id],
      recommendedLabs: [createdLabs[2]._id],
      userId: hospitalAccounts[1]._id
    });
    console.log(`✅ Created 2 hospitals with doctor references.`);

    console.log('\n🎉 NEW RANDOM DATABASE SEEDED SUCCESSFULLY!');
    console.log('──────────────────────────────────────────────');
    console.log('Demo Patient Login Details:');
    console.log('  Email: patient@demo.com  / Password: password123');
    console.log('  Email: patient2@demo.com / Password: password123');
    console.log('Demo Doctor Login Details:');
    console.log('  Email: doctor@demo.com   / Password: password123');
    console.log('Demo Lab Account Login Details:');
    console.log('  Email: lab1@demo.com     / Password: password123');
    console.log('Demo Hospital Login Details:');
    console.log('  Email: hospital@demo.com / Password: password123');
    console.log('──────────────────────────────────────────────\n');

    if (!skipConnect) process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    if (!skipConnect) process.exit(1);
    throw error;
  }
};

// Export for automatic db connection auto-seeding
module.exports = async () => {
  await seedDB(true);
};

// Run script directly
if (require.main === module) {
  seedDB();
}
