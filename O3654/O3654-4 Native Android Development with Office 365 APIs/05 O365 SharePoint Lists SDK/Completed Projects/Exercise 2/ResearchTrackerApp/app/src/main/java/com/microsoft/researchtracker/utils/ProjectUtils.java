package com.microsoft.researchtracker.utils;

import android.graphics.Color;

import com.microsoft.researchtracker.sharepoint.models.ResearchProjectModel;

public class ProjectUtils {

    /**
     * Returns the "Hue" of the project [0..360]
     * @param project the project
     * @return the hue
     */
    private static float getProjectHue(ResearchProjectModel project) {

        if (project == null) {
            return 0;
        }

        String hash = project.getId() + project.getTitle();

        return (float) (Math.abs(Math.sin(hash.hashCode())) * 360);
    }

    /**
     * Calculates the color of the project based on hashing some important properties.
     * @param project The project.
     * @return The color.
     */
    public static int getProjectColor(ResearchProjectModel project) {

        float hue = getProjectHue(project);

        return Color.HSVToColor(0xff, new float[] { hue, 0.8f, 0.85f });
    }
}
