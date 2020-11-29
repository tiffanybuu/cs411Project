
CREATE PROCEDURE Generate_Playlist(
    IN tag VARCHAR(255),
    IN playlistID VARCHAR(255),
    IN userID VARCHAR(255)
    )

    BEGIN 
    DECLARE done INT default 0;
    DECLARE songURL_v VARCHAR(255);
    DECLARE songTitle_v VARCHAR(100);
    DECLARE source_v VARCHAR(100);
    DECLARE totCount_v INT;	

    DECLARE song_countcur CURSOR
    FOR
    SELECT SongURL, SongTitle, Source, COUNT(SongURL)
    FROM Tags NATURAL JOIN PlaylistEntry AND SongURL NOT IN (SELECT SongURL FROM PlaylistEntry WHERE PlaylistID = playlistID)
    WHERE TagName = tag
    GROUP BY SongURL, SongTitle, Source
    ORDER BY COUNT(SongURL) desc;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN song_countcur;
    REPEAT
        FETCH song_countcur INTO songURL_v, songTitle_v, source_v, totCount_v;
        IF totCount_v > 1 THEN INSERT INTO PlaylistEntry(SongID, PlaylistID, SongTitle, Source, SongURL) VALUES (CONCAT(playlistID, "-", songURL_v), playlistID, songTitle_v, source_v, songURL_v);
        END IF;
    UNTIL done 
    END REPEAT;

    CLOSE song_countcur;

    END;

CREATE PROCEDURE Popular_Playlist_Songs(
    IN tag VARCHAR(255),
    IN newPlaylistID VARCHAR(255),
    IN playlistID VARCHAR(255)
    )

    BEGIN 
    DECLARE done INT default 0;
    DECLARE songURL_v VARCHAR(255);
    DECLARE songTitle_v VARCHAR(100);
    DECLARE source_v VARCHAR(100);

    DECLARE songs_cur CURSOR
    FOR
    SELECT SongURL, SongTitle, Source
    FROM PlaylistEntry 
    WHERE PlaylistID = playlistID AND SongURL NOT IN (
        SELECT SongURL FROM PlaylistEntry WHERE PlaylistID = newPlaylistID
    );
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN songs_cur;
    REPEAT
        FETCH songs_cur INTO songURL_v, songTitle_v, source_v;
        INSERT INTO PlaylistEntry(SongID, PlaylistID, SongTitle, Source, SongURL) VALUES (CONCAT(newPlaylistID, "-", songURL_v), newPlaylistID, songTitle_v, source_v, songURL_v);
    UNTIL done 
    END REPEAT;

    CLOSE songs_cur;

    END;

