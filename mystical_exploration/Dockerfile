FROM ubuntu:22.04

# Avoid prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install required packages
RUN apt-get update && apt-get install -y \
    git \
    perl \
    ghostscript \
    netpbm \
    && rm -rf /var/lib/apt/lists*

# Create working directory
WORKDIR /workspace

# Copy the gstopdf script
RUN mkdir -p /usr/local/bin
COPY gstopdf /usr/local/bin/gstopdf
RUN chmod +x /usr/local/bin/gstopdf

# Set up environment
ENV PATH="/usr/local/bin:${PATH}"

# Default command
CMD ["/bin/bash"]