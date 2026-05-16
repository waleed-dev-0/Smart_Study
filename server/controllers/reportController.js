import User from "../models/user.js";
import DocumentModel from "../models/document.js";

const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getReportsData = async (req, res) => {
  try {
    const [totalUsers, archivedSources, storageResult, users] = await Promise.all([
      User.countDocuments(),
      DocumentModel.countDocuments(),
      DocumentModel.aggregate([
        { $group: { _id: null, totalBytes: { $sum: "$file_size_bytes" } } }
      ]),
      User.aggregate([
        { $lookup: { from: "documents", localField: "_id", foreignField: "user_id", as: "docs" } },
        { $project: {
            name: "$username", email: 1,
            files: { $size: "$docs" },
            status: { $cond: { if: { $gt: [{ $size: "$docs" }, 0] }, then: "Active", else: "Inactive" } }
        }},
        { $sort: { files: -1 } },
        { $limit: 20 }
      ])
    ]);

    const totalBytes = storageResult[0]?.totalBytes || 0;

    const scholarActivity = users.map(u => ({
      id: u._id, name: u.name, email: u.email,
      files: u.files, status: u.status
    }));

    res.status(200).json({
      success: true,
      data: { totalUsers, archivedSources, digitalStorage: formatBytes(totalBytes), scholarActivity }
    });
  } catch (error) {
    console.error("Reports generation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
