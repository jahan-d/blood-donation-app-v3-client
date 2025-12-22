import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const AddBlog = () => {
    const token = localStorage.getItem("access-token");
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm();

    const mutation = useMutation({
        mutationFn: async (newBlog) => {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/blogs`,
                newBlog,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
        onSuccess: () => {
            toast.success("Blog published successfully!");
            queryClient.invalidateQueries(["blogs"]);
            reset();
        },
        onError: () => {
            toast.error("Failed to publish blog.");
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <div className="p-5 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Add New Blog</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Title</span>
                    </label>
                    <input
                        {...register("title", { required: true })}
                        placeholder="Blog Title"
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Thumbnail URL</span>
                    </label>
                    <input
                        {...register("thumbnail", { required: true })}
                        placeholder="Image URL"
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Content (HTML or Text)</span>
                    </label>
                    <textarea
                        {...register("content", { required: true })}
                        placeholder="Write your blog content here..."
                        className="textarea textarea-bordered h-60 w-full"
                        required
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={mutation.isLoading}
                    className="btn btn-primary w-full"
                >
                    {mutation.isLoading ? "Publishing..." : "Publish Blog"}
                </button>
            </form>
        </div>
    );
};

export default AddBlog;
