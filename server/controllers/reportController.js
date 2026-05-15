import User from "../models/user.js";
import DocumentModel from "../models/document.js";

export const getReportsData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const archivedSources = await DocumentModel.countDocuments();
    
    const storageResult = await DocumentModel.aggregate([
      {
        $group: {
          _id: null,
          totalBytes: { $sum: "$file_size_bytes" }
        }
      }
    ]);
    const totalBytes = storageResult.length > 0 ? storageResult[0].totalBytes || 0 : 0;
    
    let digitalStorage = "0 B";
    if (totalBytes > 0) {
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(totalBytes) / Math.log(k));
      digitalStorage = parseFloat((totalBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    const usersWithDocCount = await User.aggregate([
      {
        $lookup: {
          from: "documents",
          localField: "_id",
          foreignField: "user_id",
          as: "docs"
        }
      },
      {
        $project: {
          name: "$username",
          email: 1,
          files: { $size: "$docs" },
          status: { $cond: { if: { $gt: [{ $size: "$docs" }, 0] }, then: "Active", else: "Inactive" } },
          lastActiveDate: { $max: "$docs.createdAt" }
        }
      },
      { $sort: { files: -1 } },
      { $limit: 20 }
    ]);
    
    const scholarActivity = usersWithDocCount.map((u, i) => {
      let lastActive = "Never";
      if (u.lastActiveDate) {
        const diffMs = Date.now() - new Date(u.lastActiveDate).getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor(diffMs / (1000 * 60));
        if (diffDays > 0) lastActive = `${diffDays} days ago`;
        else if (diffHours > 0) lastActive = `${diffHours} hours ago`;
        else if (diffMins > 0) lastActive = `${diffMins} minutes ago`;
        else lastActive = "Just now";
      }
      return {
        id: u._id,
        name: u.name,
        email: u.email,
        files: u.files,
        lastActive: lastActive,
        status: u.status
      };
    });
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    
    const enrollments = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const weeklyTrends = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const match = enrollments.find(e => e._id === dStr);
      weeklyTrends.push(match ? match.count : 0);
    }
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        archivedSources,
        digitalStorage,
        scholarActivity,
        weeklyTrends
      }
    });
    
  } catch (error) {
    console.error("Reports generation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
