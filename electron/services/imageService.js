import fs from "fs";
import path from "path";
import crypto from "crypto";
import { app, dialog } from "electron";

function getImageDirectory() {
    const imagesDir = path.join(app.getPath("userData"), "images");

    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    return imagesDir;
}

export async function importImage() {
    const result = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
            {
                name: "Images",
                extensions: ["jpg", "jpeg", "png", "gif", "bmp", "webp"]
            }
        ]
    });

    if(result.canceled || result.filePaths.length === 0) {
        return null;
    }

    const sourcePath = result.filePaths[0];
    const extension = path.extname(sourcePath);
    const fileName = `${crypto.randomUUID()}${extension}`;
    const destinationPath = path.join(getImageDirectory(), fileName);
    
    fs.copyFileSync(sourcePath, destinationPath);
    return {
        fileName, 
        path: destinationPath,
        url: `smartstickies://images/${fileName}`
    };
}

export function saveClipboardImage(buffer, extension = ".png") {
    const fileName = `${crypto.randomUUID()}${extension}`;
    const destinationPath = path.join(getImageDirectory(), fileName);

    fs.writeFileSync(destinationPath, Buffer.from(buffer));

    return {
        fileName,
        path: destinationPath,
        url: `smartstickies://images/${fileName}`
    };
}