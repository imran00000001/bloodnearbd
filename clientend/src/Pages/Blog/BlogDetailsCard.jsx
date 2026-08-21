import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import HTMLReactParser from "html-react-parser";
import usePublicAxios from "../../hooks/usePublicAxios";
import LoadingCom from "../../Components/Loading/LoadingCom";
import PageTitle from "../../Components/PageTitle/PageTitle";

const BlogDetailsCard = () => {
  const { id } = useParams();
  const axiosPublic = usePublicAxios();

  const { data: blog, isPending } = useQuery({
    queryKey: ["blogDetails", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/blog/${id}`);
      return res.data;
    },
  });

  if (isPending) {
    return <LoadingCom />;
  }

  if (!blog) {
    return (
      <div className="container mx-auto py-20 text-center">
        <Typography variant="h5">Blog post not found</Typography>
        <Link to="/blog" className="text-[#7A1128] underline">
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <PageTitle text={blog?.title} subHeading={`by ${blog?.author}`} />
      <Card className="mt-6 mb-10">
        <CardBody>
          {blog?.blogImg && (
            <img
              className="h-96 w-full rounded-lg object-cover object-center mb-6"
              src={blog?.blogImg}
              alt={blog?.title}
            />
          )}
          <Typography>{HTMLReactParser(blog?.blogContent || "")}</Typography>
        </CardBody>
      </Card>
      <Link to="/blog" className="text-[#7A1128] underline">
        ← Back to all blogs
      </Link>
    </div>
  );
};

export default BlogDetailsCard;
