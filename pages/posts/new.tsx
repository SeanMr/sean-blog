import { useForm } from 'hooks/useForm';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import postApi from '../../api/post';
import PostProps from '../../api/types/post';

const PostNew: NextPage = () => {
  const router = useRouter();
  const onSubmit = (formData: PostProps) => {
    postApi
      .postsNew({ post: formData })
      .then(() => {
        window.alert('发布成功');
        router.back();
      })
      .catch((e) => {
        setErrors(e.message);
      });
  };

  const { form, setErrors } = useForm<PostProps>({
    initFormData: { title: '', content: '' },
    fields: [
      {
        label: '标题',
        key: 'title',
      },
      {
        label: '内容',
        type: 'textarea',
        key: 'content',
      },
    ],
    buttons: <button type="submit">发布</button>,
    onSubmit,
  });

  return (
    <div>
      <h1>文章发布</h1>
      {form}
    </div>
  );
};

export default PostNew;
