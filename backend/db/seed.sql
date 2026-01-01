INSERT INTO universities (name, location, region, website) VALUES
('University of Ghana', 'Accra', 'Greater Accra', 'www.ug.edu.gh'),
('Kwame Nkrumah University of Science and Technology', 'Kumasi', 'Ashanti', 'www.knust.edu.gh'),
('University of Cape Coast', 'Cape Coast', 'Central', 'www.ucc.edu.gh'),
('Ashesi University', 'Accra', 'Greater Accra', 'www.ashesi.edu.gh'),
('Ghana Institute of Management and Public Administration', 'Accra', 'Greater Accra', 'www.gimpa.edu.gh');

INSERT INTO programs (universityId, name, category, maxCutoff, requiredSubjects, scholarshipAvailable) VALUES
(1, 'Computer Science', 'Engineering', 24, '["Mathematics", "Physics"]', true),
(1, 'Medicine', 'Health', 18, '["Mathematics", "Physics", "Chemistry", "Biology"]', true),
(1, 'Law', 'Social Sciences', 28, '["English", "Social Studies"]', false),
(2, 'Electrical Engineering', 'Engineering', 26, '["Mathematics", "Physics", "Chemistry"]', true),
(2, 'Mechanical Engineering', 'Engineering', 27, '["Mathematics", "Physics"]', true),
(3, 'Business Administration', 'Business', 30, '["Mathematics", "English"]', false),
(4, 'Software Engineering', 'Engineering', 22, '["Mathematics", "Physics"]', true),
(5, 'Public Administration', 'Social Sciences', 32, '["English", "Social Studies"]', false);
