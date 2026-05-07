-- GYMPRO AZURE SQL DATABASE SCHEMA
-- Execute this in your Azure SQL Query Editor

-- 1. TRAINERS TABLE
CREATE TABLE Trainers (
    TrainerID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Specialty NVARCHAR(50),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- 2. MEMBERS TABLE
CREATE TABLE Members (
    MemberID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    TrainerID INT FOREIGN KEY REFERENCES Trainers(TrainerID),
    JoinedDate DATETIME DEFAULT GETDATE(),
    Description NVARCHAR(MAX)
);

-- 3. PLANS TABLE
CREATE TABLE MembershipPlans (
    PlanID INT PRIMARY KEY IDENTITY(1,1),
    PlanName NVARCHAR(50) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    DurationDays INT NOT NULL
);

-- 4. PAYMENTS TABLE
CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    MemberID INT FOREIGN KEY REFERENCES Members(MemberID),
    PlanID INT FOREIGN KEY REFERENCES MembershipPlans(PlanID),
    Amount DECIMAL(10, 2) NOT NULL,
    StartDate DATETIME DEFAULT GETDATE(),
    EndDate DATETIME NOT NULL,
    TransactionRef NVARCHAR(100) UNIQUE
);

-- INITIAL SEED DATA
INSERT INTO Trainers (FullName, Email, PasswordHash, Specialty) 
VALUES ('Arjun Pro', 'trainer@gympro.com', 'trainer123', 'Bodybuilding');

INSERT INTO MembershipPlans (PlanName, Price, DurationDays)
VALUES ('Starter', 1000, 30), ('Pro', 2500, 90), ('Elite', 4500, 180);
