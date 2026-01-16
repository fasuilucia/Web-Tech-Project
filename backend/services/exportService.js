const { createObjectCsvWriter } = require('csv-writer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs').promises;

/**
 * Export Service
 * Handles exporting attendance data to CSV and XLSX formats
 */
class ExportService {
    /**
     * Export attendance data to CSV format
     * @param {Array} attendanceData - Array of attendance records
     * @param {string} filename - Output filename (without extension)
     * @returns {Promise<string>} Path to generated CSV file
     */
    async exportToCSV(attendanceData, filename) {
        try {
            const outputPath = path.join(__dirname, '..', 'exports', `${filename}.csv`);

            // Ensure exports directory exists
            await fs.mkdir(path.dirname(outputPath), { recursive: true });

            // Define CSV headers
            const csvWriter = createObjectCsvWriter({
                path: outputPath,
                header: [
                    { id: 'eventName', title: 'Event Name' },
                    { id: 'participantName', title: 'Participant Name' },
                    { id: 'participantEmail', title: 'Participant Email' },
                    { id: 'confirmedAt', title: 'Confirmed At' },
                ],
            });

            // Write data to CSV
            await csvWriter.writeRecords(attendanceData);

            console.log(`CSV export created: ${outputPath}`);
            return outputPath;
        } catch (error) {
            console.error('Error exporting to CSV:', error);
            throw new Error('Failed to export to CSV');
        }
    }

    /**
     * Export attendance data to XLSX format
     * @param {Array} attendanceData - Array of attendance records
     * @param {string} filename - Output filename (without extension)
     * @returns {Promise<string>} Path to generated XLSX file
     */
    async exportToXLSX(attendanceData, filename) {
        try {
            const outputPath = path.join(__dirname, '..', 'exports', `${filename}.xlsx`);

            // Ensure exports directory exists
            await fs.mkdir(path.dirname(outputPath), { recursive: true });

            // Prepare data for XLSX
            const worksheetData = [
                ['Event Name', 'Participant Name', 'Participant Email', 'Confirmed At'],
                ...attendanceData.map(record => [
                    record.eventName,
                    record.participantName,
                    record.participantEmail,
                    record.confirmedAt,
                ]),
            ];

            // Create workbook and worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

            // Set column widths
            worksheet['!cols'] = [
                { wch: 30 }, // Event Name
                { wch: 25 }, // Participant Name
                { wch: 30 }, // Participant Email
                { wch: 20 }, // Confirmed At
            ];

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

            // Write to file
            XLSX.writeFile(workbook, outputPath);

            console.log(`XLSX export created: ${outputPath}`);
            return outputPath;
        } catch (error) {
            console.error('Error exporting to XLSX:', error);
            throw new Error('Failed to export to XLSX');
        }
    }

    /**
     * Format attendance data for export
     * @param {Array} attendances - Raw attendance records from database
     * @returns {Array} Formatted attendance data
     */
    formatAttendanceData(attendances) {
        return attendances.map(attendance => ({
            eventName: attendance.event?.name || 'N/A',
            participantName: attendance.participant?.name || 'N/A',
            participantEmail: attendance.participant?.email || 'N/A',
            confirmedAt: new Date(attendance.confirmed_at).toLocaleString(),
        }));
    }

    /**
     * Clean up old export files
     * @param {number} maxAgeHours - Maximum age of files to keep (default: 24 hours)
     */
    async cleanupOldExports(maxAgeHours = 24) {
        try {
            const exportsDir = path.join(__dirname, '..', 'exports');
            const files = await fs.readdir(exportsDir);
            const now = Date.now();
            const maxAge = maxAgeHours * 60 * 60 * 1000;

            for (const file of files) {
                const filePath = path.join(exportsDir, file);
                const stats = await fs.stat(filePath);
                const age = now - stats.mtimeMs;

                if (age > maxAge) {
                    await fs.unlink(filePath);
                    console.log(`Deleted old export file: ${file}`);
                }
            }
        } catch (error) {
            console.error('Error cleaning up old exports:', error);
        }
    }
}

// Create singleton instance
const exportService = new ExportService();

module.exports = exportService;
