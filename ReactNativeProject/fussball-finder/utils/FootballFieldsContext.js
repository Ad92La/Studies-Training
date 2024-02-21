import React, { createContext, useState, useEffect } from 'react';
import { dummyFootballFields } from '../Navigation/DummyData.js';

export const FootballFieldsContext = createContext();

export const FootballFieldsProvider = ({ children }) => {
    const [footballFields, setFootballFields] = useState([]);

    useEffect(() => {
        setFootballFields(dummyFootballFields);
    }, []);

    const toggleFavorite = (fieldId) => {
        setFootballFields(fields =>
            fields.map(field =>
                field.id === fieldId ? { ...field, isFavorite: !field.isFavorite } : field
            )
        );
    };

    return (
        <FootballFieldsContext.Provider value={{ footballFields, toggleFavorite }}>
            {children}
        </FootballFieldsContext.Provider>
    );
};