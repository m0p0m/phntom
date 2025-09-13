const InstalledApp = require('../models/InstalledApp');

// @desc    Get all installed apps for a device
// @route   GET /api/apps/:deviceId
// @access  Private
const getInstalledApps = async (req, res) => {
  try {
    const apps = await InstalledApp.find({ deviceId: req.params.deviceId }).sort({ appName: 1 });
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Syncs the list of installed apps from a device
// @route   POST /api/apps/sync
// @access  Private
const syncInstalledApps = async (req, res) => {
  const { deviceId, apps } = req.body;

  if (!deviceId || !Array.isArray(apps)) {
    return res.status(400).json({ message: 'Please provide a deviceId and an array of apps' });
  }

  try {
    const currentPackages = apps.map(app => app.packageName);

    // 1. Delete apps that are no longer installed
    await InstalledApp.deleteMany({
      deviceId: deviceId,
      packageName: { $nin: currentPackages },
    });

    // 2. Upsert all apps from the device payload
    const upsertOperations = apps.map(app => ({
      updateOne: {
        filter: { deviceId: deviceId, packageName: app.packageName },
        update: {
          $set: {
            appName: app.appName,
            version: app.version,
            installedAt: app.installedAt,
          },
        },
        upsert: true,
      },
    }));

    if (upsertOperations.length > 0) {
      await InstalledApp.bulkWrite(upsertOperations);
    }

    res.status(200).json({ message: 'Sync successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getInstalledApps,
  syncInstalledApps,
};
