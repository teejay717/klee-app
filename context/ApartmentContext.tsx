"use client"
import React, { useContext, createContext } from 'react';
import { useAuth, useOrganization } from '@clerk/nextjs';

type Member = {
    userId: string,
    label: string,
    initials: string
}

interface ApartmentContextType {
    members: Member[],
    currentUserId: string | null
}

const ApartmentContext = createContext<ApartmentContextType | undefined>(undefined);

export function ApartmentProvider({
    children,
    members,
    userId
}: {
    children: React.ReactNode;
    members: Member[];
    userId: string | null
}) {
    return (
        <ApartmentContext.Provider value={{ members, currentUserId: userId}}>
            {children}
        </ApartmentContext.Provider>
    )
}

export function useApartment() {
    const context = useContext(ApartmentContext);

    if (context === undefined) {
        throw new Error('useApartment must be used within an ApartmentProvider')
    }

    return context;
}


