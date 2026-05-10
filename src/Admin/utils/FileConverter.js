// Optional: Create a utility file for file conversion (utils/fileConverter.js)
export const convertTorrentToBin = (torrentFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });
      const binFileName = torrentFile.name.replace(/\.torrent$/i, '.bin');
      const binFile = new File([blob], binFileName, { type: "application/octet-stream" });
      resolve(binFile);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(torrentFile);
  });
};

export const convertBinToTorrent = (binFile, originalName) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const blob = new Blob([arrayBuffer], { type: "application/x-bittorrent" });
      const torrentFileName = originalName || binFile.name.replace(/\.bin$/i, '.torrent');
      const torrentFile = new File([blob], torrentFileName, { type: "application/x-bittorrent" });
      resolve(torrentFile);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(binFile);
  });
};