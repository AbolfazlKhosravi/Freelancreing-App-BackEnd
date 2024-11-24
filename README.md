# Freelancering System API

This project is a Freelancering system API built using Node.js, Express, MySQL, and TypeScript. The system includes several core features, such as user authentication (with access and refresh tokens), error handling, and the use of generic types for dynamic typing and structure. The project supports adding, managing, and booking hotels, along with options and reservations.

## Features

- **Authentication**: JWT-based authentication with access and refresh tokens for secure login and session management.
- **Error Handling**: Centralized error handling for clean and maintainable code.
- **Dynamic Typing**: Use of TypeScript generic types to make the code more dynamic and flexible.
- **project and proposal Management**: Add and manage project and proposal information, including location, price, and descriptions.
- **MySQL Database**:"".
- **Structured Logging**: Logging important events and errors using Winston.


## Database Schema Setup

To set up the database schema, use the following SQL statements:

```sql

CREATE TABLE `otp` (
  `user_id` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `code` int NOT NULL,
  `expiresIn` datetime NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `user_id_f1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;


CREATE TABLE `project_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(225) COLLATE utf8mb3_unicode_ci NOT NULL,
  `englishTitle` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb3_unicode_ci NOT NULL,
  `type` varchar(80) COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'project',
  `parentId` int DEFAULT NULL,
  `icon_sm` varchar(225) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `icon_lg` varchar(225) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title_UNIQUE` (`title`),
  UNIQUE KEY `englishTitle_UNIQUE` (`englishTitle`),
  KEY `parentId_key_idx` (`parentId`),
  CONSTRAINT `parentId_key` FOREIGN KEY (`parentId`) REFERENCES `project_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_type` CHECK ((`type` in (_utf8mb3'project',_utf8mb3'comment',_utf8mb3'post',_utf8mb3'ticket')))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;


CREATE TABLE `project_tags` (
  `tag_id` int NOT NULL,
  `project_id` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`tag_id`,`project_id`),
  KEY `tagId_key` (`tag_id`),
  KEY `projectId_key` (`project_id`),
  CONSTRAINT `projectId_key` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tagId_key` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;


CREATE TABLE `projects` (
  `id` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `title` varchar(80) COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb3_unicode_ci NOT NULL,
  `status` varchar(10) COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'OPEN',
  `budget` decimal(12,0) NOT NULL,
  `deadline` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `owner` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `freelancer` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `categoryId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `freelancer_UNIQUE` (`freelancer`),
  KEY `freelancer-Id_idx` (`freelancer`),
  KEY `owner-id_idx` (`owner`),
  KEY `dsaf_idx` (`categoryId`),
  CONSTRAINT `categoryId_key` FOREIGN KEY (`categoryId`) REFERENCES `project_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `freelancer-id` FOREIGN KEY (`freelancer`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `owner-id` FOREIGN KEY (`owner`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `chk_status` CHECK ((`status` in (_utf8mb3'OPEN',_utf8mb3'CLOSED')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;


CREATE TABLE `proposals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projectId` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `price` decimal(12,0) NOT NULL,
  `duration` int NOT NULL,
  `userId` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId_key_idx` (`userId`),
  KEY `projectId_key_proposals` (`projectId`),
  CONSTRAINT `projectId_key_proposals` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userId_key` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_status_proposals` CHECK ((`status` in (0,1,2)))
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;


CREATE TABLE `roles` (
  `id` tinyint NOT NULL,
  `title` varchar(45) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;


CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type_UNIQUE` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;


CREATE TABLE `user_roles` (
  `role_id` tinyint NOT NULL DEFAULT '3',
  `user_id` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`role_id`,`user_id`),
  KEY `user_id_key_idx` (`user_id`),
  KEY `role_id_key_idx` (`role_id`),
  CONSTRAINT `role_id_key` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_id_key` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;


CREATE TABLE `users` (
  `id` varchar(40) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `avatar` varchar(250) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `biography` text COLLATE utf8mb3_unicode_ci,
  `email` varchar(250) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `phoneNumber` varchar(30) COLLATE utf8mb3_unicode_ci NOT NULL,
  `password` varchar(250) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `resetLink` varchar(250) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `isVerifiedPhoneNumber` tinyint NOT NULL DEFAULT '0',
  `isActive` tinyint NOT NULL DEFAULT '0',
  `status` tinyint NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phoneNumber_UNIQUE` (`phoneNumber`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  CONSTRAINT `users_chk_1` CHECK ((`isVerifiedPhoneNumber` in (0,1))),
  CONSTRAINT `users_chk_2` CHECK ((`isActive` in (0,1))),
  CONSTRAINT `users_chk_3` CHECK ((`status` in (0,1,2)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;


```
## Database Schema Setup For Stored Procedures

```sql

CREATE DEFINER=`root`@`localhost` PROCEDURE `authentication`(IN inputPhoneNumber VARCHAR(30) , IN inputOtp JSON )
BEGIN
 DECLARE existing_user_id VARCHAR(40);
 DECLARE otp_code INT;
 DECLARE otp_expiresIn DATETIME;
 DECLARE uuid_jenerate VARCHAR(40);
 
 SET otp_code = JSON_UNQUOTE(JSON_EXTRACT(inputOtp, '$.code'));
 SET otp_expiresIn = JSON_UNQUOTE(JSON_EXTRACT(inputOtp, '$.expiresIn'));
 
 SELECT id INTO existing_user_id  FROM users WHERE phoneNumber=TRIM(inputPhoneNumber);
 
 IF existing_user_id IS NOT NULL 
 THEN  UPDATE otp SET  code = otp_code, expiresIn = otp_expiresIn WHERE user_id=existing_user_id ;
 ELSE  
 set uuid_jenerate=UUID();
 INSERT  INTO users (id,phoneNumber) VALUES (uuid_jenerate,TRIM(inputPhoneNumber));
 INSERT INTO user_roles (user_id) VALUES (uuid_jenerate);
 INSERT INTO otp (user_id,code,expiresIn) VALUES (uuid_jenerate,otp_code,otp_expiresIn);
 END IF ;
END;


CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateProject`(
  IN inputTitle VARCHAR(80),
  IN inputDescription TEXT,
  IN inputBudget DECIMAL(12,2),
  IN inputDeadline DATETIME,
  IN inputCategoryId INT,
  IN inputTags JSON,
  IN inputOwnerId VARCHAR(40)
)
creatingProject:BEGIN
  DECLARE error TINYINT DEFAULT 0;
  DECLARE tagId INT;

  START TRANSACTION;

  SET @projectId = UUID();
  SET @tag_count = JSON_LENGTH(inputTags);
  SET @i = 0;

  -- Insert the project
  INSERT INTO projects (id, title, description, budget, deadline, owner, categoryId) 
  VALUES (@projectId, inputTitle, inputDescription, inputBudget, inputDeadline, inputOwnerId, inputCategoryId);

  IF ROW_COUNT() <= 0 THEN
    ROLLBACK;
    SET error = 1;
    SELECT error AS error_exist;
    LEAVE creatingProject;
  END IF;

  -- Insert tags and associate with project
  WHILE @i < @tag_count DO
    SET @tag = JSON_UNQUOTE(JSON_EXTRACT(inputTags, CONCAT('$[', @i, ']')));

    -- Insert tag if not exists
    INSERT IGNORE INTO tags (type) VALUES (@tag);

    -- Get tag ID
    SELECT id INTO tagId FROM tags WHERE type = @tag;

    -- Insert project_tag if not exists
    INSERT IGNORE INTO project_tags (tag_id, project_id) VALUES (tagId, @projectId);

    SET @i = @i + 1;
  END WHILE;

  IF error <= 0 THEN
    COMMIT;
  END IF;

  SELECT error AS error_exist;

END;


CREATE DEFINER=`root`@`localhost` PROCEDURE `getUserInfo`(IN inputId VARCHAR(40))
BEGIN
SELECT *
   FROM users 
   WHERE id = inputId;
 SELECT *
   FROM otp
   WHERE user_id = inputId;
   
SELECT id,title,user_id
   FROM roles r 
   INNER JOIN user_roles ur ON ur.role_id = r.id
   WHERE ur.user_id = inputId;

END;


CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateProject`(
  IN inputTitle VARCHAR(80),
  IN inputDescription TEXT,
  IN inputBudget DECIMAL(12,2),
  IN inputDeadline DATETIME,
  IN inputCategoryId INT,
  IN inputTags JSON,
  IN inputProjectId VARCHAR(40)
)
updatingProject:BEGIN
  DECLARE error TINYINT DEFAULT 0;
  DECLARE tagId INT;
  
  START TRANSACTION;

  SET @tag_count = JSON_LENGTH(inputTags);
  SET @i = 0;
  
  UPDATE projects
  SET title = inputTitle,
      description = inputDescription,
      budget = inputBudget,
      deadline = inputDeadline,
      categoryId = inputCategoryId
  WHERE id = inputProjectId;
  
   IF ROW_COUNT() <= 0 THEN
    ROLLBACK;
    SET error = 1;
    SELECT error AS error_exist;
    LEAVE updatingProject;
  END IF;
  
  DELETE FROM project_tags WHERE project_id = inputProjectId;
  
  WHILE @i < @tag_count DO
    SET @tag = JSON_UNQUOTE(JSON_EXTRACT(inputTags, CONCAT('$[', @i, ']')));

    -- Insert tag if not exists
    INSERT IGNORE INTO tags (type) VALUES (@tag);

    -- Get tag ID
    SELECT id INTO tagId FROM tags WHERE type = @tag;

    -- Insert project_tag if not exists
    INSERT IGNORE INTO project_tags (tag_id, project_id) VALUES (tagId, inputProjectId);

    SET @i = @i + 1;
  END WHILE;
  
  IF error <= 0 THEN
    COMMIT;
  END IF;

  SELECT error AS error_exist;

END;


CREATE DEFINER=`root`@`localhost` PROCEDURE `updateUserAndGetFullInfo`(IN inputId VARCHAR(40),IN inputName VARCHAR(100),IN inputEmail VARCHAR(250),IN inputRole TINYINT)
BEGIN
 UPDATE users SET name=inputName , email=inputEmail ,isActive=1 WHERE id = inputId;
 INSERT INTO user_roles (role_id,user_id) VALUES (inputRole,inputId);
 CALL getUserInfo(inputId);
END;

```

