/**
 * Subject Search 2.0 - Personal Academic Library
 * Allows students to bookmark courses, save study resources, and take personal course notes.
 */

import { idbStorage, STORES } from '../cache/indexeddb.js';

export class PersonalLibrary {
    constructor() {
        this.items = [];
    }

    async init() {
        this.items = await idbStorage.getAll(STORES.USER_LIBRARY);
    }

    async saveCourse(courseCode, collectionName = 'المفضلة') {
        const id = `lib_${courseCode}`;
        const item = {
            id,
            type: 'course',
            courseCode,
            collection: collectionName,
            notes: '',
            updatedAt: new Date().toISOString()
        };

        this.items = this.items.filter(i => i.id !== id);
        this.items.push(item);
        await idbStorage.set(STORES.USER_LIBRARY, item);
        return item;
    }

    async removeCourse(courseCode) {
        const id = `lib_${courseCode}`;
        this.items = this.items.filter(i => i.id !== id);
        await idbStorage.delete(STORES.USER_LIBRARY, id);
    }

    isSaved(courseCode) {
        return this.items.some(i => i.courseCode === courseCode);
    }

    async updateNotes(courseCode, notes) {
        const id = `lib_${courseCode}`;
        let item = this.items.find(i => i.id === id);
        if (!item) {
            item = {
                id,
                type: 'course',
                courseCode,
                collection: 'المفضلة',
                notes: notes,
                updatedAt: new Date().toISOString()
            };
            this.items.push(item);
        } else {
            item.notes = notes;
            item.updatedAt = new Date().toISOString();
        }
        await idbStorage.set(STORES.USER_LIBRARY, item);
        return item;
    }

    getAllSavedCourses() {
        return this.items.filter(i => i.type === 'course');
    }
}

export const personalLibrary = new PersonalLibrary();
export default personalLibrary;
