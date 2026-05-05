"use client"
import React, { useContext, createContext } from 'react';
import { useAuth, useOrganization } from '@clerk/nextjs';

type Member = {
    userId: string,
    label: string,
    initials: string,
    imageUrl?: string
}

interface ApartmentContextType {
    members: Member[],
    currentUserId: string | null
}

const ApartmentContext = createContext<ApartmentContextType | undefined>(undefined);

export function ApartmentProvider({ children }: { children: React.ReactNode }) {

    const { userId } = useAuth();
    const { memberships } = useOrganization({
        memberships: {
            keepPreviousData: true,
        }
    })

    const membersList = memberships?.data?.map((mem) => {
        const user = mem.publicUserData;

        if (!user) return null;
        
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
        const initials = [user.firstName?.charAt(0), user.lastName?.charAt(0)].filter(Boolean).join("").toUpperCase();

        return {
            userId: user.userId,
            label: fullName || user.identifier || "Unknown Member",
            initials: initials,
            imageUrl: user.imageUrl
        }
    }).filter(Boolean) as Member[] ?? [];

    return (
        <ApartmentContext.Provider value={{ members: membersList, currentUserId: userId ?? null}}>
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


