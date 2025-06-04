import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("--- Starting Database Seeding ---");

  const numberOfUsers = 10;
  const numberOfPosts = 10;
  const users = [];
  const posts = [];

  // --- 1. Seed Users ---
  console.log(`\nCreating ${numberOfUsers} users...`);
  for (let i = 0; i < numberOfUsers; i++) {
    // Generate a base name (e.g., "John Doe", "Jane Smith")
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const baseFullName = `${firstName} ${lastName}`;

    // Derive username and email from the base name, ensuring uniqueness
    // by appending a counter or a random number if needed.
    // We'll use the loop index 'i' to guarantee uniqueness for these 10 users.
    const uniqueSuffix = i > 0 ? `${i}` : ""; // Avoid suffix for the first user
    const username =
      `${firstName.toLowerCase()}${lastName.toLowerCase()}${uniqueSuffix}`.replace(
        /\s/g,
        ""
      ); // e.g., "johndoe", "janesmith1"
    const email =
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}${uniqueSuffix}@example.com`.replace(
        /\s/g,
        ""
      ); // e.g., "john.doe@example.com", "jane.smith1@example.com"

    const hashedPassword = await bcrypt.hash("Anko2025", 10);
    const profilePicUrl = faker.image.avatar();
    const bio = faker.person.bio();

    const user = await prisma.user.upsert({
      where: { email: email }, // Use the derived unique email
      update: {
        fullName: baseFullName,
        username: username,
        hashedPassword: hashedPassword,
        profilePicUrl: profilePicUrl,
        bio: bio,
      },
      create: {
        email: email, // Use the derived unique email
        fullName: baseFullName,
        username: username,
        hashedPassword: hashedPassword,
        profilePicUrl: profilePicUrl,
        bio: bio,
      },
    });
    users.push(user);
    console.log(
      `- Upserted user: ${user.username} (ID: ${user.id}) | Full Name: ${user.fullName} | Email: ${user.email}`
    );
  }

  // --- 2. Seed Posts ---
  console.log(`\nCreating ${numberOfPosts} posts...`);
  for (let i = 0; i < numberOfPosts; i++) {
    const randomUser = faker.helpers.arrayElement(users); // Pick a random user to be the author
    const content = faker.lorem.paragraphs(
      faker.number.int({ min: 1, max: 3 })
    ); // 1-3 paragraphs of content

    const post = await prisma.post.create({
      data: {
        authorId: randomUser.id,
        content: content,
      },
    });
    posts.push(post);
    console.log(`- Created post (ID: ${post.id}) by ${randomUser.username}`);
  }

  // --- 3. Seed Likes ---
  console.log("\nCreating likes for posts...");
  for (const post of posts) {
    const numberOfLikes = faker.number.int({ min: 0, max: 5 });
    const potentialLikers = users.filter((user) => user.id !== post.authorId);

    const likers = faker.helpers.arrayElements(potentialLikers, {
      min: 0,
      max: numberOfLikes,
    });

    for (const liker of likers) {
      try {
        await prisma.postLike.create({
          data: {
            userId: liker.id,
            postId: post.id,
          },
        });
        // console.log(`  - ${liker.username} liked post ${post.id}`);
      } catch (error) {
        // console.warn(`  - Warning: ${liker.username} already liked post ${post.id}`);
      }
    }
  }
  console.log("Likes seeding complete.");

  // --- 4. Seed Comments ---
  console.log("\nCreating comments for posts...");
  for (const post of posts) {
    const numberOfComments = faker.number.int({ min: 0, max: 4 });
    const commenters = faker.helpers.arrayElements(users, {
      min: 0,
      max: numberOfComments,
    });

    for (const commenter of commenters) {
      await prisma.comment.create({
        data: {
          userId: commenter.id,
          postId: post.id,
          content: faker.lorem.sentence(),
        },
      });
      // console.log(`  - ${commenter.username} commented on post ${post.id}`);
    }
  }
  console.log("Comments seeding complete.");

  // --- 5. Seed Follow Relationships ---
  console.log("\nCreating follow relationships...");
  for (let i = 0; i < users.length; i++) {
    const follower = users[i];
    const numToFollow = faker.number.int({ min: 0, max: 3 });

    const potentialFollowings = users.filter((user) => user.id !== follower.id);
    const actualFollowings = faker.helpers.arrayElements(potentialFollowings, {
      min: 0,
      max: numToFollow,
    });

    for (const following of actualFollowings) {
      try {
        await prisma.follow.create({
          data: {
            followerId: follower.id,
            followingId: following.id,
            status: faker.helpers.arrayElement(["ACCEPTED", "PENDING"]),
          },
        });
        // console.log(`  - ${follower.username} followed ${following.username}`);
      } catch (error) {
        // console.warn(`  - Warning: ${follower.username} already follows ${following.username}`);
      }
    }
  }
  console.log("Follow relationships seeding complete.");

  console.log("\n--- Database Seeding Complete! ---");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
