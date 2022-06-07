MySQL FAQs

[1] How to install MySQL in Windows?
    
    1.  Go to: https://dev.mysql.com/downloads/mysql/ 
    2.  Download the appropriate installer for your OS
    3.  Run the installer once downloaded and follow the instructions
            // If you are a beginner, it is recommended to use the Developer Default for installation.
            // You will be asked to enter a password for MySQL root user. Kindly take note of this.


[2] How to navigate MySQL?
    
    1. Run your installed commandline client. (Example: MySQL 5.7 Command Line Client)

    Below are common commands in MySQL: 
    -----------------
    Create a database.
		CREATE DATABASE project_database;
    
    -----------------
    Use a database, show databases, show tables, describe a table.
		USE project_database;
    	SHOW DATABASES;	
		SHOW TABLES;
        DESCRIBE users;

    -----------------
    Example: create table.
        CREATE TABLE student(
                student_id 		INT,
                name 			VARCHAR(20),
                major			VARCHAR(20),
                PRIMARY KEY(student_id)
            );

    -----------------
    Example: query data.
		SELECT * FROM student;
		SELECT * FROM student WHERE major = 'Chemistry' OR major = 'Biology';
		SELECT * FROM student WHERE student_id <=3 AND name <> 'Jack';
		
    -----------------

[3] How to import an existing database (MySQL, Windows)

	1. Create empty database
        mysql> CREATE DATABASE <db_name>;
	2. Dump the database to be imported to the empty database
        mysql -u <username> -p <db_name> < <name_of_db_to_import.sql>

    EXAMPLE:
        ** Open MySQL shell and log in **
        mysql> CREATE DATABASE project_db;
        ** Exit MySQL shell **
        ** Open cmd to the location where the file to be imported is located**
        mysql -u root -p project_db < import_me.sql
        ** Enter password when prompted **

	// If the command runs successfully, it won't produce any output.
	// Check if the import was successful by logging in to MySQL shell itself.

	// If cmd told you mysql is not defined, add its bin to path
	//	set path=%PATH%;C:\Program Files\MySQL\MySQL Server 5.7\bin;


[4] Connection to backend.

    Make sure that your database credentials are used in backend's index.js file (GWA-Verifier/backend/index.js).
        Look for mysql.createConnection() command. 
        Replace user and password arguments with your appropriate credentials.
        Replace database argument with the database to be used.
