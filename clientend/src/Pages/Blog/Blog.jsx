
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import LoadingCom from "../../Components/Loading/LoadingCom";
import PageTitle from "../../Components/PageTitle/PageTitle";
import useBlogData from "../../hooks/useBlogData";
import useAuth from "../../hooks/useAuth";
import BlogCard from "./BlogCard";


const Blog = () => {
  const { blogData, isBlogDataLoading, refetch } = useBlogData(null);
  const { user } = useAuth();

  if (isBlogDataLoading) {
    return <LoadingCom />
  }
  return (
    <div>

      <PageTitle text={"Blog"} subHeading={'Donate blood save life'} />

      {user && (
        <div className="container mx-auto flex justify-end mb-4">
          <Link to="/dashboard/addBlog">
            <Button variant="contained" sx={{ bgcolor: "#7A1128", color: "white" }}>
              Write a Blog
            </Button>
          </Link>
        </div>
      )}

      {blogData?.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          No published blog posts yet.
        </p>
      )}

      {blogData?.map(data => <BlogCard key={data._id} data={data} />)}

    </div>
  );
};

export default Blog;
