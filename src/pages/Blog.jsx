import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";

const Blog = () => {
    const { data: blogs = [], isLoading } = useQuery({
        queryKey: ["blogs"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`);
            return res.data;
        },
    });

    if (isLoading) return <p className="text-center py-10">Loading blogs...</p>;

    return (
        <div className="container mx-auto py-10 px-5">
            <h1 className="text-3xl font-bold text-center mb-8">Our Blog</h1>

            {blogs.length === 0 ? (
                <p className="text-center text-gray-500">No blogs published yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="card bg-base-100 shadow-xl border">
                            <figure>
                                <img
                                    src={blog.thumbnail}
                                    alt={blog.title}
                                    className="h-48 w-full object-cover"
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">
                                    {blog.title}
                                    <div className="badge badge-secondary">NEW</div>
                                </h2>
                                <p className="text-sm text-gray-500 mb-2">
                                    {new Date(blog.createdAt).toDateString()}
                                </p>
                                <div
                                    className="prose text-sm line-clamp-3"
                                    dangerouslySetInnerHTML={{ __html: blog.content }} // CAUTION: Safe only if content is sanitized on input or trusted
                                ></div>
                                <div className="card-actions justify-end mt-4">
                                    <Link to={`/blog/${blog._id}`} className="btn btn-primary btn-sm">
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blog;
