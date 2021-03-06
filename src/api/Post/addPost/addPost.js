import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    addPost: async (_, args, { request }) => {
      isAuthenticated(request);
      const { user } = request;
      const { caption, location, files } = args;
      const post = await prisma.createPost({
        caption, location, user: { connect: { id: user.id } }
      });
      files.forEach(async file => {
        await prisma.createFile({
          url: file,
          post: {
            connect: {
              id: post.id
            }
          }
        });
      });
      return post;
    }
  }
}
