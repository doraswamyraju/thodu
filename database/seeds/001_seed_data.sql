-- Initial Seed Data for Thodu

-- 1. Default Service Categories
INSERT INTO service_categories (id, name, slug, icon_name, description) VALUES
('a0000000-0000-0000-0000-000000000001', 'Household Support', 'household-support', 'home', 'Light housekeeping, laundry, home organization and daily household tasks.'),
('a0000000-0000-0000-0000-000000000002', 'Cooking Assistance', 'cooking-assistance', 'utensils', 'Nutritious meal preparation according to dietary preferences.'),
('a0000000-0000-0000-0000-000000000003', 'Medication Reminders', 'medication-reminders', 'pill', 'Timely prompts and tracking for prescribed medications.'),
('a0000000-0000-0000-0000-000000000004', 'Grocery & Errands', 'grocery-errands', 'shopping-bag', 'Assistance with buying provisions, medicines, and errands.'),
('a0000000-0000-0000-0000-000000000005', 'Companionship & Care', 'companionship-care', 'heart-handshake', 'Friendly conversation, reading, walks, and emotional support.'),
('a0000000-0000-0000-0000-000000000006', 'Disability Support', 'disability-support', 'accessibility', 'Assisted mobility, daily living support, and compassionate accompaniment.');

-- 2. Default Services
INSERT INTO services (id, category_id, name, slug, description, duration_hours, base_price_paise, includes) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Household Support', 'household-support-standard', 'Light housekeeping, laundry, home organization and daily household tasks.', 2.0, 60000, ARRAY['Light housekeeping', 'Laundry and folding', 'Home organization']),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'Cooking Assistance', 'cooking-assistance-standard', 'Home-cooked healthy vegetarian or non-vegetarian meals.', 2.0, 45000, ARRAY['Meal prep', 'Kitchen tidying', 'Diet tracking']);

-- 3. Sponsorship Programmes
INSERT INTO sponsorship_programmes (id, name, description, subsidy_percentage) VALUES
('c0000000-0000-0000-0000-000000000001', 'Elder Care Support Programme', 'Sri Divyang Seva Kendram Trust subsidized elder care for low income seniors.', 100),
('c0000000-0000-0000-0000-000000000002', 'Disability Care Aid', 'Trust and donor assisted daily living support for persons with disabilities.', 80);
