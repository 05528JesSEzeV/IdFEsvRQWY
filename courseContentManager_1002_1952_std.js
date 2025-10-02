// 代码生成时间: 2025-10-02 19:52:54
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Manages course content, including adding, updating, and deleting course content.
 * @class CourseContentManager
 */
class CourseContentManager {

  /**
   * Create a new instance of CourseContentManager.
   * @param {string} dataPath - The path to store course content data.
   */
  constructor(dataPath) {
    this.dataPath = dataPath;
    this.courses = [];
  }

  /**
   * Loads course content from a JSON file.
   */
  loadCourses() {
    try {
      const data = fs.readFileSync(path.join(this.dataPath, 'courses.json'), 'utf8');
      this.courses = JSON.parse(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }

  /**
   * Saves course content to a JSON file.
   */
  saveCourses() {
    try {
      const data = JSON.stringify(this.courses);
      fs.writeFileSync(path.join(this.dataPath, 'courses.json'), data);
    } catch (error) {
      console.error('Error saving courses:', error);
    }
  }

  /**
   * Adds a new course to the course content.
   * @param {Object} course - The new course object.
   */
  addCourse(course) {
    if (!course.name || !course.description) {
      throw new Error('Course must have a name and description.');
    }
    course.id = uuidv4(); // Generate a unique ID for the course
    this.courses.push(course);
    this.saveCourses();
  }

  /**
   * Updates an existing course in the course content.
   * @param {string} id - The ID of the course to update.
   * @param {Object} updates - The updated course object.
   */
  updateCourse(id, updates) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Course not found.');
    }
    this.courses[index] = { ...this.courses[index], ...updates };
    this.saveCourses();
  }

  /**
   * Deletes a course from the course content.
   * @param {string} id - The ID of the course to delete.
   */
  deleteCourse(id) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Course not found.');
    }
    this.courses.splice(index, 1);
    this.saveCourses();
  }
}

// Example usage:
const manager = new CourseContentManager(path.join(app.getPath('userData'), 'courseData'));
manager.loadCourses();

// Add a new course
manager.addCourse({ name: 'Introduction to JavaScript', description: 'Learn the basics of JavaScript.' });

// Update a course
manager.updateCourse('some-course-id', { description: 'Updated description of the course.' });

// Delete a course
manager.deleteCourse('some-course-id');