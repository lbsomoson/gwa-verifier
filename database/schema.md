This file contains information about the database design.
Last Update: 4/19/2022 Lance Taag

Link to Google Sheet Schema: https://docs.google.com/spreadsheets/d/1OLg4GssPlOvgTwZ6z-4fXzNeVmesjFt1EVQA1wtF_1o/edit#gid=0
Name of the database: database_project
======================================================================================

// TABLES IN database_project;
mysql> SHOW TABLES;
+----------------------------+
| Tables_in_database_project |
+----------------------------+
| curricula                  |
| gesubjects                 |
| students                   |
| taken_courses              |
| users                      |
+----------------------------+
5 rows in set (0.00 sec)


// TABLE DETAILS: curricula 
// 	This is where the curriculum per degree program can be accessed.
mysql> DESC curricula;
+------------+------------+------+-----+---------+-------+
| Field      | Type       | Null | Key | Default | Extra |
+------------+------------+------+-----+---------+-------+
| Program    | varchar(5) | NO   | PRI | NULL    |       |
| Curriculum | longtext   | YES  |     | NULL    |       |
+------------+------------+------+-----+---------+-------+
2 rows in set (0.00 sec)


// TABLE DETAILS: gesubjects
//	This is where the list of ge subjects can be accessed.
mysql> DESC gesubjects;
+-------------+--------------+------+-----+---------+-------+
| Field       | Type         | Null | Key | Default | Extra |
+-------------+--------------+------+-----+---------+-------+
| Course_Code | varchar(10)  | NO   | PRI | NULL    |       |
| Type        | varchar(10)  | YES  |     | NULL    |       |
| Units       | decimal(3,2) | YES  |     | NULL    |       |
+-------------+--------------+------+-----+---------+-------+
3 rows in set (0.00 sec)


// TABLE DETAILS: students
//	This is where the list of students can be accessed.
mysql> DESC students;
+------------+--------------+------+-----+---------+-------+
| Field      | Type         | Null | Key | Default | Extra |
+------------+--------------+------+-----+---------+-------+
| ID         | int(5)       | NO   | PRI | NULL    |       |
| First_Name | varchar(20)  | YES  |     | NULL    |       |
| Last_Name  | varchar(20)  | YES  |     | NULL    |       |
| Program    | varchar(5)   | YES  | MUL | NULL    |       |
| GWA        | decimal(5,4) | YES  |     | NULL    |       |
+------------+--------------+------+-----+---------+-------+
5 rows in set (0.00 sec)


// TABLE DETAILS: taken_courses
//	This is the data where the taken_courses of all students will be stored.
mysql> DESC taken_courses;
+-------------+--------------+------+-----+---------+-------+
| Field       | Type         | Null | Key | Default | Extra |
+-------------+--------------+------+-----+---------+-------+
| ID          | int(5)       | NO   | PRI | NULL    |       |
| Course_Code | varchar(10)  | NO   | PRI | NULL    |       |
| Course_Type | varchar(10)  | YES  |     | NULL    |       |
| Grade       | decimal(3,2) | YES  |     | NULL    |       |
| Units       | decimal(3,2) | YES  |     | NULL    |       |
| Weight      | decimal(3,2) | YES  |     | NULL    |       |
| Term        | varchar(20)  | YES  |     | NULL    |       |
+-------------+--------------+------+-----+---------+-------+
7 rows in set (0.00 sec)


// TABLE DETAILS: users
//	This is where the account data is stored.
mysql> DESC users;
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| Username | varchar(30) | NO   | PRI | NULL    |       |
| Password | varchar(20) | YES  |     | NULL    |       |
| Type     | varchar(10) | YES  |     | NULL    |       |
+----------+-------------+------+-----+---------+-------+
3 rows in set (0.00 sec)
