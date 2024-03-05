const basePath = 'https://.Your.Database.Link.Here.firebasedatabase.app';

import { dummyFootballFields } from "../Navigation/DummyData";


export async function fetchAllFields() {
    try {
        const res = await fetch(`${basePath}/field.json`);
        const data = await res.json();
        const fields = Object.keys(data).map(key => {
            return data[key];
        })
        return fields;

    } catch (error) {
        console.log('An error occured while trying to fetch all field data.', error);
    }   
}


export async function fetchFieldById(id) {
    try {
        const res = await fetch(`${basePath}/field/${id}.json`);
        const data = await res.json();

    } catch (error) {
        console.log('An error occured while trying to fetch field data by id.', error);
    }
}


export async function uploadField(fieldData) {
    try {
        const res = await fetch(`${basePath}/field.json`, {
            method: 'POST',
            body: JSON.stringify(fieldData),
        });
        const data = await res.json();

    } catch (error) {
        console.log('An error occured while trying to upload field data.', error);
    }
}


export async function uploadAllFields() {
    dummyFootballFields.forEach(uploadField);
}


//uploadAllFields();