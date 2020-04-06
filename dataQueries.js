// ACTIVITY

// Get data for date => in main page on click
SELECT * FROM activityData WHERE date = '15-04-2020' AND type = 'Посещение'

// Get data for code
SELECT * FROM activityData WHERE code = 'Ершов Максим Леонидович'

// Change code 
UPDATE activityData SET code = 'test1' WHERE code = 'Ершов Максим Леонидович'

// Delete all by code
DELETE FROM activityData WHERE code = 'Ершов Максим Леонидович'

// Delete one 
DELETE FROM activityData WHERE code = 'Ершов Максим Леонидович' AND date = '15-04-2020' AND time = '11:10' AND type = 'Посещение' AND person = '' AND amount = ''




// PERSON DATA

// Get all data
SELECT * FROM personData


// Change field 
UPDATE personData SET code = 'test1' WHERE code = 'Ершов Максим Леонидович'

// Delete person (by code)
DELETE FROM personData WHERE code = 'Ершов Максим Леонидович'

