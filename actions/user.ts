"use server"

import { fetchUserByExternalId, fetchUserById, isUsernameTaken } from "@/data/user";
import { db } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export const updateUser = async (userId: string, params: any) => {
    await clerkClient.users.updateUser(userId, params);
}

export const updateUserDB = async (externalId: string, params: any) => {
    try {
        console.log(params)
        await db.user.update({
            where: {externalId},
            data: params
        })
    } catch (err) {
        console.log(err)
    }

}

export const ServerFetchUserByExternalId = async (externalId: string) => {
    const user = await fetchUserByExternalId(externalId)

    return user
}

export const ServerFetchUserById = async (id: string) => {
    const user = await fetchUserById(id)

    return user
}

export const ServerCheckUsernameAvailability = async (username: string) => {
    const fetchedUsername = await isUsernameTaken(username)

    return fetchedUsername
}