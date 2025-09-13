const InstalledApp = require('../models/InstalledApp');
const Device = require('../models/Device');

// @desc    Get all installed apps for a device
// @route   GET /api/devices/:deviceId/apps
// @access  Private
const getInstalledApps = async (req, res) => {
  res.status(200).json(res.advancedResults);
};

// @desc    Syncs the list of installed apps from a device
// @route   POST /api/devices/:deviceId/apps/sync
// @access  Private
const syncInstalledApps = async (req, res) => {
  const { apps } = req.body;
  const { deviceId } = req.params;

  if (!Array.isArray(apps)) {
    return res.status(400).json({ message: 'Please provide an array of apps' });
  }

  try {
    const device = await Device.findById(deviceId);
    if (!device) {
        return res.status(404).json({ message: 'Device not found' });
    }

    const currentPackages = apps.map(app => app.packageName);

    await InstalledApp.deleteMany({
      device: deviceId,
      packageName: { $nin: currentPackages },
    });

    const upsertOperations = apps.map(app => ({
      updateOne: {
        filter: { device: deviceId, packageName: app.packageName },
        update: {
          $set: {
            appName: app.appName,
            version: app.version,
            installedAt: app.installedAt,
            device: deviceId,
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
