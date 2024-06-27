// import prisma from '@/lib/prisma';

// function getAllUsers() {
//     return prisma.account.findMany()
// }

// function getUserById(userId: string) {
//     return prisma.account.findFirstOrThrow({
//         where: {
//             id: Number(userId)
//         }
//     })
// }

// function createUser(userName: string) {
//     return prisma.account.create({
//         data: {
//             name: userName
//         }
//     })
// }

// function updateUser(userId: string, userName: string) {
//     return prisma.account.update({
//         where: {
//             id: Number(userId)
//         },
//         data: {
//             name: userName
//         }
//     })
// }

// function deleteUser(userId: string) {
//     return prisma.account.delete({
//         where: {
//             id: Number(userId)
//         }
//     })
// }

// export {
//     createUser, deleteUser, getAllUsers, getUserById, updateUser
// };

