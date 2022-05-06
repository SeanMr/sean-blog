import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { Post } from 'src/entity/Post';
import styles from 'styles/Home.module.css';
import qs from 'querystring';
import usePager from 'hooks/usePager';

interface Props {
  posts: Post[];
  count: number;
  perPage: number;
  page: number;
  totalPage: number;
}

const PostsIndex: NextPage<Props> = (props) => {
  const { posts, count, page, totalPage } = props;
  const { pager } = usePager({ count, page, totalPage });

  return (
    <div>
      <h1 className={styles.container}>文章列表（{count}）</h1>
      {posts.map((p) => (
        <div key={p.id} className={styles.font}>
          <Link href={`/posts/${p.id}`}>
            <a>{p.title || '默认文章'}</a>
          </Link>
        </div>
      ))}
      <footer>{pager}</footer>
    </div>
  );
};

export default PostsIndex;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.req.url.split('?').pop();
  const params = new URLSearchParams(query);
  const page = parseInt(params.get('page'));
  const perPage = 3;
  const connection = await getDatabaseConnection();
  const [posts, count] = await connection.manager.findAndCount(Post, {
    skip: (page - 1) * perPage,
    take: perPage,
  });
  console.log(posts);

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      count,
      page,
      totalPage: Math.ceil(count / perPage),
    },
  };
};
